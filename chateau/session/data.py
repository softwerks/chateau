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
from typing import Dict, Optional
import uuid

from dateutil import tz
from werkzeug import useragents


class SessionData:
    """Session data."""

    def __init__(self, data: Dict[bytes, bytes]) -> None:
        self._data = data

    def _property(self, name: bytes) -> Optional[str]:
        value: Optional[bytes] = self._data.get(name)
        if value is not None:
            return value.decode()
        return None

    @property
    def address(self) -> Optional[str]:
        return self._property(b"address")

    @property
    def browser(self) -> Optional[str]:
        user_agent_str: Optional[str] = self._property(b"user_agent")
        if user_agent_str is not None:
            return useragents.UserAgent(user_agent_str).browser
        return None

    @property
    def created(self) -> float:
        return float(self._data[b"created"].decode())

    @property
    def game_id(self) -> Optional[uuid.UUID]:
        game_id: Optional[str] = self._property(b"game_id")
        if game_id is not None:
            return uuid.UUID(game_id)
        return None

    @property
    def last_seen(self) -> float:
        return float(self._data[b"last_seen"].decode())

    @property
    def os(self) -> Optional[str]:
        user_agent_str: Optional[str] = self._property(b"user_agent")
        if user_agent_str is not None:
            return useragents.UserAgent(user_agent_str).platform
        return None

    @property
    def session_type(self) -> Optional[str]:
        return self._property(b"type")

    @property
    def time_zone(self) -> Optional[datetime.tzinfo]:
        time_zone: bytes = self._data.get(b"time_zone", b"UTC")
        tzinfo: Optional[datetime.tzinfo] = tz.gettz(time_zone.decode())
        return tzinfo

    @property
    def user_id(self) -> Optional[str]:
        return self._property(b"id")
