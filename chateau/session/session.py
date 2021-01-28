# Copyright 2020 Softwerks LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import datetime
import secrets
import time
from typing import Dict, List, Optional, Set, Union
import uuid

import flask
import redis

from chateau.session.data import SessionData


class Session:
    """Session data persisted between requests."""

    authenticated: bool
    data: SessionData
    key: str
    store: redis.Redis
    token: str

    @staticmethod
    def _key(token: str) -> str:
        """Return the session store key."""
        return f"session:{token}"

    def __init__(self, store: redis.Redis) -> None:
        def valid() -> bool:
            """Return the status of the user's session."""
            return (
                False
                if flask.session.get("id") is None
                or not self.store.exists(f"session:{flask.session['id']}")
                else True
            )

        def update_timestamp() -> None:
            """Update the user's last seen timestamp."""
            self.store.hset(self.key, "last_seen", time.time())

        def load() -> None:
            """Load the user's session."""
            self.data = SessionData(self.store.hgetall(self.key))
            self.authenticated = (
                True if self.data.session_type == "authenticated" else False
            )

        self.store = store
        if not valid():
            self.new()
        self.token = flask.session["id"]
        self.key = self._key(self.token)
        update_timestamp()
        load()

    @staticmethod
    def _index_key(user_id: str) -> str:
        """Return the index key."""
        return f"user:sessions:{user_id}"

    def _add_to_index(self, user_id: str, token: str) -> None:
        """Add the session to the user's index."""
        self.store.sadd(self._index_key(user_id), token)

    def _remove_from_index(self, user_id: str, token: str) -> None:
        """Remove the session from the user's index."""
        self.store.srem(self._index_key(user_id), token)

    def new(
        self,
        *,
        type_: str = "anonymous",
        id_: Optional[int] = None,
        time_zone: Optional[str] = None,
    ) -> None:
        """Create a new session."""

        def get_address() -> str:
            """Return the user's IP address."""
            if flask.request.headers.get("X-Real-IP") is not None:
                return flask.request.headers["X-Real-IP"]
            else:
                return flask.request.remote_addr

        token: str = secrets.token_urlsafe()

        session_data: Dict[str, str] = {}
        session_data["type"] = type_
        if id_ is not None:
            session_data["id"] = str(id_)
        if time_zone is not None:
            session_data["time_zone"] = time_zone
        session_data["address"] = get_address()
        session_data["user_agent"] = flask.request.user_agent.string
        session_data["created"] = str(time.time())

        session_key: str = self._key(token)
        pipe: redis.client.Pipeline = self.store.pipeline()
        for key, value in session_data.items():
            assert isinstance(value, str)
            pipe.hset(session_key, key, value)
        pipe.expire(session_key, datetime.timedelta(days=30))
        pipe.execute()

        if id_ is not None:
            self._add_to_index(str(id_), token)

        flask.session.clear()
        flask.session["id"] = token

    def delete(self) -> None:
        """Delete the session."""
        if self.authenticated:
            assert self.data.user_id is not None
            self._remove_from_index(self.data.user_id, self.token)
        self.store.delete(self.key)
        flask.session.clear()

    def _tokens_in_index(self) -> Set[str]:
        """Return all of the authenticated user's session tokens."""
        if self.authenticated:
            assert self.data.user_id is not None
            sessions: Set[str] = set()
            for token in self.store.smembers(self._index_key(self.data.user_id)):
                assert isinstance(token, bytes)
                sessions.add(token.decode())
            return sessions
        else:
            raise ValueError("Anonymous sessions are not indexed.")

    def all(self) -> List[SessionData]:
        """Return a list of the user's sessions."""
        if self.authenticated:
            return [
                SessionData(self.store.hgetall(self._key(token)))
                for token in self._tokens_in_index()
            ]
        else:
            return [self.data]

    def delete_all(self) -> None:
        """Delete all of the authenticated user's sessions."""
        if self.authenticated:
            for token in self._tokens_in_index():
                self.store.delete(self._key(token))
            assert self.data.user_id is not None
            self.store.delete(self._index_key(self.data.user_id))
        else:
            self.delete()
        flask.session.clear()

    def websocket_token(self) -> str:
        """Return a token that can be used to establish a websocket connection."""
        token: str = secrets.token_urlsafe()
        self.store.setex("websocket:" + token, 10, self.token)
        return token

    def game_id(self) -> Optional[uuid.UUID]:
        """Return the user's game ID."""
        if self.authenticated:
            assert self.data.user_id is not None
            game_id: Optional[bytes] = self.store.hget("games", self.data.user_id)
            return uuid.UUID(game_id.decode()) if game_id is not None else None
        else:
            return self.data.game_id

    def _add_to_game_index(self, game_id: uuid.UUID) -> None:
        """Add the user's game to the index."""
        assert self.data.user_id is not None
        self.store.hset("games", self.data.user_id, str(game_id))

    def custom_game(self) -> uuid.UUID:
        """Create a new custom game."""
        assert self.game_id() is None

        game_id: uuid.UUID = uuid.uuid4()

        if self.authenticated:
            self._add_to_game_index(game_id)
        else:
            self.store.hset(self.key, "game_id", str(game_id))

        return game_id
