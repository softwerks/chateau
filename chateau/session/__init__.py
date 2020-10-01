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
from typing import Union

import flask
import redis


def init_app(app: flask.app.Flask, pool: redis.ConnectionPool) -> None:
    """Initialize the app."""
    app.before_request(partial(load, pool))


def load(pool: redis.ConnectionPool) -> None:
    session_store = connect(pool)
    session_id = flask.session.get("session_id")

    if session_id is None:
        flask.g.user = None


def connect(pool: redis.ConnectionPool) -> redis.Redis:
    if "session_store" not in flask.g:
        flask.g.session_store = redis.Redis(connection_pool=pool)

    return flask.g.session_store
