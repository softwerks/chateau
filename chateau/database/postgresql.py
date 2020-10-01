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
import logging
from typing import Callable, Optional, Union

import psycopg2
import psycopg2.extras

import chateau.database


logger = logging.getLogger(__name__)


def _operation(func: Callable) -> Callable:
    """Execute a database operation."""

    @functools.wraps(func)
    def wrapper(
        self, statement: str, vars: Union[list, tuple, dict, None] = None
    ) -> Callable:
        try:
            with self.db:
                with self.db.cursor() as cur:
                    return func(self, statement, vars, cur)
        except psycopg2.Error as e:
            logger.error(f"{e.pgcode} {e.pgerror}")
            raise chateau.database.DatabaseError

    return wrapper


class PostgreSQL:
    """Database."""

    def __init__(self, dsn: str) -> None:
        self.db = PostgreSQL._connect(dsn)

    @staticmethod
    def _connect(dsn: str) -> psycopg2.extensions.connection:
        """Get a database session."""
        db = psycopg2.connect(dsn, cursor_factory=psycopg2.extras.DictCursor)
        return db

    def close(self) -> None:
        """Close the database."""
        self.db.close()

    @_operation
    def execute(
        self,
        statement: str,
        vars: Union[list, tuple, dict, None],
        cur: psycopg2.extras.DictCursor,
    ) -> None:
        """Execute a database query."""
        cur.execute(statement, vars)

    @_operation
    def query(
        self,
        statement: str,
        vars: Union[list, tuple, dict, None],
        cur: psycopg2.extras.DictCursor,
    ) -> Optional[psycopg2.extras.DictRow]:
        """Execute a database query and return all results."""
        cur.execute(statement, vars)
        return cur.fetchall()

    @_operation
    def queryone(
        self,
        statement: str,
        vars: Union[list, tuple, dict, None],
        cur: psycopg2.extras.DictCursor,
    ) -> Optional[psycopg2.extras.DictRow]:
        """Execute a datbase query and return the first result."""
        cur.execute(statement, vars)
        return cur.fetchone()
