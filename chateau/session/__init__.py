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

import flask
import redis

from chateau.session import session


def init_app(app: flask.app.Flask, session_store: redis.Redis) -> None:
    """Initialize the app."""
    app.before_request(partial(load, session_store))


def load(session_store: redis.Redis) -> None:
    if "session" not in flask.g:
        flask.g.session = session.Session(session_store)
    print(flask.g.session.data)
