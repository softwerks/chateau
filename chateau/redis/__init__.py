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

from functools import partial
from typing import Optional

import flask
from redis import Redis


def init_app(app: flask.app.Flask, redis: Redis) -> None:
    """Initialize the app."""
    app.before_request(partial(before, redis))


def before(redis: Redis) -> None:
    """Add redis to global."""
    if "redis" not in flask.g:
        flask.g.redis = redis
