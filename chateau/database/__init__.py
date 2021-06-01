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
import psycopg2.pool

from chateau.database import auth
from chateau.database import connection


class DatabaseError(Exception):
    """Database error."""

    pass


def init_app(app: flask.app.Flask, pool: psycopg2.pool.ThreadedConnectionPool) -> None:
    """Initialize the app."""
    app.before_request(partial(connect, pool))
    app.teardown_appcontext(close)


def connect(pool: psycopg2.pool.ThreadedConnectionPool) -> None:
    """Connect to the database."""
    if "db" not in flask.g:
        flask.g.db = connection.Connection(pool)


def close(error: Union[int, Exception] = None) -> None:
    """Close the database."""
    db = flask.g.pop("db", None)

    if db is not None:
        db.close()
