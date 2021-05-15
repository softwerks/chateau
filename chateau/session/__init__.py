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
import time
import secrets
from typing import Dict, Optional

import flask
import redis.client

from chateau.session.session import Session


def init_app(app: flask.app.Flask) -> None:
    """Initialize the app."""
    app.before_request(load)


def load() -> None:
    if "session" not in flask.g:
        token: str = flask.session.get("id")
        if token is not None:
            data: Dict[str, str] = flask.g.redis.hgetall(f"session:{token}")
            if data:
                flask.g.session = Session(token=token, **data)
                return
        flask.g.session = new()


def new(user_id: Optional[int] = None, time_zone: Optional[str] = None) -> Session:
    token: str = secrets.token_urlsafe()

    data: Dict[str, str] = {}

    if flask.request.headers.get("X-Real-IP") is not None:
        data["address"] = flask.request.headers["X-Real-IP"]
    else:
        data["address"] = flask.request.remote_addr

    data["created"] = data["last_seen"] = str(time.time())

    data["user_agent"] = flask.request.user_agent.string

    if user_id is not None:
        data["user_id"] = str(user_id)

    if time_zone is not None:
        data["time_zone"] = time_zone

    pipeline: redis.client.Pipeline = flask.g.redis.pipeline()
    pipeline.hset(f"session:{token}", mapping=data)  # type: ignore
    pipeline.expire(f"session:{token}", datetime.timedelta(days=30))
    if user_id is not None:
        pipeline.sadd(f"user:sessions:{user_id}", token)
    pipeline.execute()

    flask.session.clear()
    flask.session["id"] = token

    return Session(token=token, **data)
