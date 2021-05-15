# Copyright 2021 Softwerks LLC
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

import dataclasses
import secrets
import time
from typing import List, Optional

import flask
import redis.client


@dataclasses.dataclass
class Session:
    """Session data persisted between requests."""

    address: str
    authenticated: bool = dataclasses.field(init=False)
    created: str
    id_: str = dataclasses.field(init=False)
    last_seen: str
    token: str
    user_agent: str
    game_id: Optional[str] = None
    time_zone: Optional[str] = None
    user_id: Optional[str] = None

    def __post_init__(self) -> None:
        if self.user_id is not None:
            self.authenticated = True
            self.id_ = self.user_id
        else:
            self.authenticated = False
            self.id_ = self.token

        if self.authenticated:
            self.game_id = flask.g.redis.hget("games", self.id_)

        self.last_seen = str(time.time())
        flask.g.redis.hset(f"session:{self.token}", "last_seen", self.last_seen)

    def all(self) -> List["Session"]:
        """Return a list of the user's sessions."""
        if self.authenticated:
            return [
                Session(token=token, **flask.g.redis.hgetall(f"session:{token}"))
                for token in flask.g.redis.smembers(f"user:sessions:{self.user_id}")
            ]
        else:
            return [self]

    def websocket_token(self) -> str:
        """Return a token that can be used to establish a websocket connection."""
        token: str = secrets.token_urlsafe()

        flask.g.redis.setex(f"websocket:{token}", 10, self.token)

        return token

    def delete_all(self) -> None:
        """Delete all of the user's sessions."""
        if self.authenticated:
            pipeline: redis.client.Pipeline = flask.g.redis.pipeline()

            for token in flask.g.redis.smembers(f"user:sessions:{self.user_id}"):
                pipeline.delete(f"session:{token}")

            pipeline.delete(f"user:sessions:{self.user_id}")

            pipeline.execute()

            flask.session.clear()
        else:
            self.delete()

    def delete(self) -> None:
        """Delete the session (log out)."""
        if self.authenticated and self.user_id is not None:
            flask.g.redis.srem(f"user:sessions:{self.user_id}", self.token)

        flask.g.redis.delete(f"session:{self.token}")

        flask.session.clear()
