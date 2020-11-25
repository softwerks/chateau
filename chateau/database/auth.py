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

import functools
from typing import Optional, Tuple

import flask
import psycopg2.extras
import werkzeug.security

from chateau import database


def create_user(username: str, password: str) -> None:
    """Create a new user."""
    if read_user(username) is None:
        flask.g.db.execute(
            """
            INSERT INTO users (username, password, created)
            VALUES (%s, %s,
                CURRENT_TIMESTAMP(0) AT TIME ZONE 'UTC')
            """,
            (username, werkzeug.security.generate_password_hash(password)),
        )


@functools.singledispatch
def read_user(username: str) -> Optional[psycopg2.extras.DictRow]:
    """Retrieve a user record."""
    user = flask.g.db.queryone(
        """
        SELECT *
        FROM users
        WHERE username = %s
        """,
        (username,),
    )
    return user


@read_user.register
def _(user_id: int) -> Optional[psycopg2.extras.DictRow]:
    """Retrieve a user record."""
    user = flask.g.db.queryone(
        """
        SELECT *
        FROM users
        WHERE id = %s
        """,
        (user_id,),
    )
    return user


def delete_user(user_id: int) -> None:
    """Delete a user record."""
    flask.g.db.execute(
        """
        DELETE FROM users
        WHERE id = %s
        """,
        (user_id,),
    )


def validate_password(
    *, username: str = None, password: str
) -> Tuple[bool, Optional[int]]:
    user: Optional[psycopg2.extras.DictRow] = None

    if username is not None:
        user = read_user(username)
    elif flask.g.session.data.user_id is not None:
        user_id: int = int(flask.g.session.data.user_id)
        user = read_user(user_id)

    if user is not None:
        password_is_valid = werkzeug.security.check_password_hash(
            user["password"], password
        )
        return password_is_valid, user["id"]
    else:
        return False, None
