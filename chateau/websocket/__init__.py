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

import secrets
import urllib.parse

import flask


def url(path: str) -> str:
    websocket_url: str

    if flask.current_app.config["DEBUG"]:
        websocket_url = f"ws://localhost:5555/socket/{path}?token={_token()}"
    else:
        url: urllib.parse.ParseResult = urllib.parse.urlparse(flask.request.url)
        scheme: str = "wss" if url.scheme == "https" else "ws"
        websocket_url = f"{scheme}://{url.netloc}/socket/{path}?token={_token()}"

    return websocket_url


def _token() -> str:
    token: str = secrets.token_urlsafe()

    flask.g.redis.setex(f"websocket:{token}", 10, flask.g.session.token)

    return token
