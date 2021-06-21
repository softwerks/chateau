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

from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from typing import Optional
import time
import urllib.parse

import flask

import redis


blueprint = flask.Blueprint("metrics", __name__)

import chateau.metrics.routes


def init_app(app: flask.app.Flask) -> None:
    """Initialize the app."""
    app.before_request(_before)
    app.after_request(_after)


def _before() -> None:
    if "start" not in flask.g:
        flask.g.start = time.perf_counter()


def _after(response: flask.Response) -> flask.Response:
    if response.status_code < HTTPStatus.BAD_REQUEST:
        _store_metrics()

    return response


def _store_metrics() -> None:
    now: datetime = datetime.now(timezone.utc)
    date: str = now.strftime("%Y-%m-%d")
    expire: int = int(
        datetime.timestamp(
            now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=30)
        )
    )

    url: urllib.parse.ParseResult = urllib.parse.urlparse(flask.request.url)

    pipeline: redis.client.Pipeline = flask.g.redis.pipeline()

    _store_page(pipeline, date, expire, url)
    _store_browser(pipeline, date, expire)
    _store_os(pipeline, date, expire)
    _store_referrer(pipeline, date, expire)
    _store_response_time(pipeline, url)

    pipeline.execute()


def _store_page(
    pipeline: redis.client.Pipeline,
    date: str,
    expire: int,
    url: urllib.parse.ParseResult,
) -> None:
    key: str = f"stats:page:{date}"
    pipeline.zincrby(key, 1, url.path)
    pipeline.expireat(key, expire)


def _store_browser(pipeline: redis.client.Pipeline, date: str, expire: int) -> None:
    browser: Optional[str] = flask.request.user_agent.browser
    if browser is not None:
        browser_key: str = f"stats:browser:{date}"
        pipeline.zincrby(browser_key, 1, browser)
        pipeline.expireat(browser_key, expire)

        version: Optional[str] = flask.request.user_agent.version
        if version is not None:
            version_key: str = f"stats:{browser}:{date}"
            pipeline.zincrby(version_key, 1, version)
            pipeline.expireat(version_key, expire)


def _store_os(pipeline: redis.client.Pipeline, date: str, expire: int) -> None:
    os: Optional[str] = flask.request.user_agent.platform
    if os is not None:
        key: str = f"stats:os:{date}"
        pipeline.zincrby(key, 1, os)
        pipeline.expireat(key, expire)


def _store_referrer(pipeline: redis.client.Pipeline, date: str, expire: int) -> None:
    referrer: Optional[str] = flask.request.referrer
    if referrer is not None:
        try:
            referrer_url: urllib.parse.ParseResult = urllib.parse.urlparse(
                flask.request.url
            )
        except:
            pass
        else:
            key: str = f"stats:referrers:{date}"
            pipeline.zincrby(key, 1, referrer_url.netloc)
            pipeline.expireat(key, expire)


def _store_response_time(
    pipeline: redis.client.Pipeline, url: urllib.parse.ParseResult
) -> None:
    response_time: float = round(time.perf_counter() - flask.g.start, 3)
    key: str = f"stats:perf:{url.path}"
    pipeline.lpush(key, response_time)
    pipeline.ltrim(key, 0, 99)
