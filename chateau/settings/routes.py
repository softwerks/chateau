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

from datetime import datetime
from typing import Optional

from dateutil import tz
import flask
from werkzeug import useragents

from chateau.settings import blueprint


@blueprint.route("security", methods=["GET", "POST"])
def security() -> str:
    return flask.render_template(
        "settings/security.html",
        sessions=[
            flask.g.session,
        ],
        browser_os=browser_os,
        local_time=local_time,
    )


def browser_os(user_agent_str: str) -> str:
    user_agent: useragents.UserAgent = useragents.UserAgent(user_agent_str)

    browser: Optional[str] = user_agent.browser
    if browser is not None:
        browser = browser.title()
    else:
        browser = "Unknown"

    os: Optional[str] = user_agent.platform
    if os is not None:
        os = os.title()
    else:
        os = "Unknown OS"

    return browser + " on " + os


def local_time(timestamp: str) -> str:
    time: datetime = datetime.fromtimestamp(float(timestamp))
    timezone: str = flask.g.session.data.get("time_zone", "UTC")
    return time.astimezone(tz.gettz(timezone)).strftime("%c")
