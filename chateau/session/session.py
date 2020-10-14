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

from dateutil import tz
import flask
import redis
from werkzeug import useragents

KEY_PREFIX = "session:"
TOKEN_LENGTH = 16

logger = logging.getLogger(__name__)


class Session:
    """Session."""

    def __init__(self, store: redis.Redis) -> None:
        self.store: redis.Redis = store
        self.data: Dict[bytes, bytes] = {}
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

        self.data = self.store.hgetall(key)
        session_type: str = self.data.get(b"type", b"anonymous").decode()
        self.authenticated: bool = True if session_type == "authenticated" else False

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

        self.load()

        user_id: Optional[str] = self.user_id()
        if user_id is not None:
            index_key: str = "user:sessions:" + user_id
            self.store.sadd(index_key, token)

        return token

    def delete(self) -> None:
        token: str = flask.session.get("id")
        key: str = KEY_PREFIX + token
        self.store.delete(key)
        user_id: Optional[str] = self.user_id()
        if user_id is not None:
            index_key: str = "user:sessions:" + user_id
            self.store.srem(index_key, token)
        flask.session.clear()

    def all(self) -> Optional[List[dict]]:
        user_id: Optional[str] = self.user_id()
        if user_id is not None:
            index_key: str = "user:sessions:" + user_id
            tokens: Set[Union[bytes, float, int, str]] = self.store.smembers(index_key)
            sessions: List[dict] = []
            for token in tokens:
                if isinstance(token, bytes):
                    session_key: str = KEY_PREFIX + token.decode()
                    sessions.append(self.store.hgetall(session_key))
            return sessions
        return None

    def user_id(self) -> Optional[str]:
        user_id: Optional[bytes] = self.data.get(b"id", None)
        if user_id is not None:
            return user_id.decode()
        return None

    def time_zone(self) -> Optional[datetime.tzinfo]:
        time_zone: bytes = self.data.get(b"timezone", b"UTC")
        tzinfo: Optional[datetime.tzinfo] = tz.gettz(time_zone.decode())
        return tzinfo

    def user_agent(self) -> useragents.UserAgent:
        return useragents.UserAgent(self.data[b"user_agent"].decode())

    def browser(self) -> Optional[str]:
        user_agent: useragents.UserAgent = self.user_agent()
        return user_agent.browser

    def os(self) -> Optional[str]:
        user_agent: useragents.UserAgent = self.user_agent()
        return user_agent.platform

    def created(self) -> float:
        return float(self.data[b"created"].decode())

    def last_seen(self) -> float:
        return float(self.data[b"last_seen"].decode())
