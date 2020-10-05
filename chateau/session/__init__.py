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
from functools import partial
import secrets

import flask
import redis

KEY_PREFIX = "session:"
TOKEN_LENGTH = 16


def init_app(app: flask.app.Flask, pool: redis.ConnectionPool) -> None:
    """Initialize the app."""
    app.before_request(partial(load, pool))


def load(pool: redis.ConnectionPool) -> None:
    token: str = flask.session.get("id")
    if token is None:
        token = _new_anonymous(pool)

    session_store: redis.Redis = redis.Redis(connection_pool=pool)
    key: str = KEY_PREFIX + token
    if not session_store.exists(key):
        token = _new_anonymous(pool)
    flask.g.session = session_store.hgetall(key)


def _new_anonymous(pool: redis.ConnectionPool) -> str:
    token: str = secrets.token_urlsafe(TOKEN_LENGTH)

    session_store: redis.Redis = redis.Redis(connection_pool=pool)
    key: str = KEY_PREFIX + token
    session_store.hmset(
        key,
        {
            "type": "anonymous",
            "address": flask.request.remote_addr,
            "user_agent": flask.request.user_agent.string,
        },
    )
    session_store.expire(key, datetime.timedelta(days=30))

    flask.session.clear()
    flask.session["id"] = token

    return token
