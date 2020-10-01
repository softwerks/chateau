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

from typing import Optional

import psycopg2.extras
import werkzeug.security

from chateau import database


def create_user(username: str, password: str) -> None:
    """Create a new user."""
    db = database.connect()
    if read_user(username) is None:
        db.execute(
            """
            INSERT INTO users (username, password, created)
            VALUES (%s, %s,
                CURRENT_TIMESTAMP(0) AT TIME ZONE 'UTC')
            """,
            (username, werkzeug.security.generate_password_hash(password)),
        )


def read_user(username: str) -> Optional[psycopg2.extras.DictRow]:
    """Retrieve a user record."""
    db = database.connect()
    user = db.queryone(
        """
        SELECT *
        FROM users
        WHERE username = %s
        """,
        (username,),
    )
    return user
