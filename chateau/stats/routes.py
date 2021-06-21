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

from datetime import datetime, timezone
from typing import List, Tuple

import flask

from chateau.stats import blueprint


@blueprint.route("")
def dashboard() -> str:
    today: str = _today()
    visitors: int = flask.g.redis.pfcount(f"stats:visitors:{today}")
    views: int = flask.g.redis.get(f"stats:views:{today}")

    return flask.render_template("stats/dashboard.html", visitors=visitors, views=views)


@blueprint.route("details")
def details() -> str:
    date: str = flask.request.args.get("date", _today())

    referrers: List[Tuple[str, float]] = flask.g.redis.zrange(
        f"stats:referrers:{date}", -10, -1, withscores=True
    )
    pages: List[Tuple[str, float]] = flask.g.redis.zrange(
        f"stats:page:{date}", -10, -1, withscores=True
    )
    browsers: List[Tuple[str, float]] = flask.g.redis.zrange(
        f"stats:browser:{date}", -10, -1, withscores=True
    )
    os: List[Tuple[str, float]] = flask.g.redis.zrange(
        f"stats:os:{date}", -10, -1, withscores=True
    )

    return flask.render_template(
        "stats/details.html",
        referrers=referrers,
        pages=pages,
        browsers=browsers,
        os=os,
    )


def _today() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")
