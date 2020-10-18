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
import logging
import secrets
import time
from typing import Dict, List, Mapping, Optional, Set, Union

import flask
import redis

from chateau.session.data import SessionData

KEY_PREFIX = "session:"
TOKEN_LENGTH = 16

logger = logging.getLogger(__name__)


class Session:
    """Session."""

    def __init__(self, store: redis.Redis) -> None:
        self.store: redis.Redis = store
        self.load()

    def load(self):
        token: str = flask.session.get("id")
        if token is None:
            token = self.new({"type": "anonymous"})

        key: str = KEY_PREFIX + token
        if not self.store.exists(key):
            token = self.new({"type": "anonymous"})
            key = KEY_PREFIX + token

        self.store.hset(key, "last_seen", time.time())

        self.data: SessionData = SessionData(self.store.hgetall(key))
        self.authenticated: bool = (
            True if self.data.session_type == "authenticated" else False
        )

    def new(
        self,
        mapping: Mapping[Union[bytes, float, int, str], Union[bytes, float, int, str]],
    ) -> str:
        token: str = secrets.token_urlsafe(TOKEN_LENGTH)

        address: Optional[str] = flask.request.headers.get("X-Real-IP")
        if address is None:
            address = flask.request.remote_addr
        user_agent: str = flask.request.user_agent.string
        created: float = time.time()
        session: Mapping[
            Union[bytes, float, int, str], Union[bytes, float, int, str]
        ] = {
            **mapping,
            "address": address,
            "user_agent": user_agent,
            "created": created,
        }

        key: str = KEY_PREFIX + token
        self.store.hmset(key, session)
        self.store.expire(key, datetime.timedelta(days=30))

        flask.session.clear()
        flask.session["id"] = token

        self.load()

        if self.data.user_id is not None:
            index_key: str = "user:sessions:" + self.data.user_id
            self.store.sadd(index_key, token)

        return token

    def delete(self) -> None:
        token: str = flask.session.get("id")
        key: str = KEY_PREFIX + token
        self.store.delete(key)
        if self.data.user_id is not None:
            index_key: str = "user:sessions:" + self.data.user_id
            self.store.srem(index_key, token)
        flask.session.clear()

    def all(self) -> Optional[List[SessionData]]:
        if self.data.user_id is not None:
            index_key: str = "user:sessions:" + self.data.user_id
            tokens: Set[Union[bytes, float, int, str]] = self.store.smembers(index_key)
            sessions: List[SessionData] = []
            for token in tokens:
                if isinstance(token, bytes):
                    session_key: str = KEY_PREFIX + token.decode()
                    sessions.append(SessionData(self.store.hgetall(session_key)))
            return sessions
        return None

    def delete_all(self) -> None:
        if self.data.user_id is not None:
            index_key: str = "user:sessions:" + self.data.user_id
            tokens: Set[Union[bytes, float, int, str]] = self.store.smembers(index_key)
            for token in tokens:
                if isinstance(token, bytes):
                    self.store.delete(KEY_PREFIX + token.decode())
            self.store.delete(index_key)
        flask.session.clear()
