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
from typing import Dict, Optional, Union

from dateutil import tz
import flask
import flask_wtf
import werkzeug
from werkzeug import useragents

from chateau.settings import blueprint
from chateau.settings import forms
from chateau.session.data import SessionData


@blueprint.route("security", methods=["GET", "POST"])
def security() -> str:
    return flask.render_template(
        "settings/security.html",
        sessions=flask.g.session.all(),
        browser_os=browser_os,
        local_time=local_time,
    )


@blueprint.route("delete", methods=["GET", "POST"])
def delete() -> Union[werkzeug.wrappers.Response, str]:
    error: Optional[str] = None
    form: flask_wtf.FlaskForm = forms.create_delete_form(
        flask.current_app.config["PASSWORD_MAX_LENGTH"]
    )
    if form.validate_on_submit():
        return flask.redirect(flask.url_for("index"))
        # error = "Invalid password."
    return flask.render_template("settings/delete.html", form=form, error=error)


def browser_os(session_data: SessionData) -> str:
    browser: Optional[str] = session_data.browser
    if browser is not None:
        browser = browser.title()
    else:
        browser = "Unknown"

    os: Optional[str] = session_data.os
    if os is not None:
        os = os.title()
    else:
        os = "Unknown OS"

    return browser + " on " + os


def local_time(timestamp: float) -> str:
    tzinfo = flask.g.session.data.time_zone
    time: datetime = datetime.fromtimestamp(timestamp)
    local: datetime = time.astimezone(tzinfo)
    return local.strftime("%c")
