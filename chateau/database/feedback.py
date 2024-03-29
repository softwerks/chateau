# Copyright 2021 Softwerks LLC
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

import flask

from chateau import database


def create(nps: int, comments: str) -> None:
    """Log feedback."""
    flask.g.db.execute(
        """
        INSERT INTO feedback (submitted, nps, comments)
        VALUES (CURRENT_TIMESTAMP(0) AT TIME ZONE 'UTC', %s, %s)
        """,
        (nps, comments),
    )
