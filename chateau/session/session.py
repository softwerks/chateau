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
from typing import Mapping, Union

import flask
import redis

KEY_PREFIX = "session:"
TOKEN_LENGTH = 16


class Session:
    """Session."""

    def __init__(self, store: redis.Redis) -> None:
        self.store: redis.Redis = store
        self.load()

    def load(self) -> dict:
        token: str = flask.session.get("id")
        if token is None:
            token = self.new({"type": "anonymous"})

        key: str = KEY_PREFIX + token
        if not self.store.exists(key):
            token = self.new({"type": "anonymous"})
            key = KEY_PREFIX + token

        self.store.hset(key, "last_seen", time.time())

        self.data: dict = self.store.hgetall(key)

        return self.data

    def new(
        self,
        mapping: Mapping[Union[bytes, float, int, str], Union[bytes, float, int, str]],
    ) -> str:
        token: str = secrets.token_urlsafe(TOKEN_LENGTH)

        address: str = flask.request.remote_addr
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

        return token

    def delete(self) -> None:
        token: str = flask.session.get("id")
        key: str = KEY_PREFIX + token
        self.store.delete(key)
        flask.session.clear()

    def is_authenticated(self) -> bool:
        print(self.data)
        return True if self.data["type"] == "authenticated" else False
