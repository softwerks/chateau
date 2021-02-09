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

DATABASE_DSN = "postgresql://user:password@host:port"
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 64
RECAPTCHA_PRIVATE_KEY = "recaptcha-private-key"
RECAPTCHA_PUBLIC_KEY = "recaptcha-public-key"
SECRET_KEY = "dev"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False
SESSION_URL = "redis://host:port?db=0"
TZDATA_MIN_LENGTH = 3
TZDATA_MAX_LENGTH = 29  # https://en.wikipedia.org/wiki/Tz_database#Names_of_time_zones
WEBSOCKET_URL = "wss://host:port/path"
