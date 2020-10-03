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

from functools import partial
import secrets

import flask
import redis

TOKEN_LENGTH = 16


def init_app(app: flask.app.Flask, pool: redis.ConnectionPool) -> None:
    """Initialize the app."""
    app.before_request(partial(load, pool))


def load(pool: redis.ConnectionPool) -> None:
    session_store = redis.Redis(connection_pool=pool)
    session_id = flask.session.get("id")

    if session_id is None:
        token: str = new()
        flask.session["id"] = token
        session_store.hset("session", token, "test")

    print(flask.session["id"])


def new() -> str:
    token: str = secrets.token_urlsafe(TOKEN_LENGTH)

    return token
