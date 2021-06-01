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

from chateau import database
from chateau.settings import blueprint
from chateau.settings import forms
from chateau.session import Session


@blueprint.route("menu")
def menu() -> str:
    return flask.render_template("settings/menu.html")


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
    password_is_valid: bool
    user_id: Optional[int]
    error: Optional[str] = None

    form: flask_wtf.FlaskForm = forms.create_delete_form(
        flask.current_app.config["PASSWORD_MAX_LENGTH"]
    )

    if form.validate_on_submit():
        try:
            password: str = form.password.data
            password_is_valid, user_id = database.auth.validate_password(
                password=password
            )

            if password_is_valid:
                if user_id is not None:
                    database.auth.delete_user(user_id)

                flask.g.session.delete_all()

                return flask.redirect(flask.url_for("index"))
            else:
                error = "Invalid password."
        except database.DatabaseError:
            flask.abort(500)
    return flask.render_template("settings/delete.html", form=form, error=error)


def browser_os(session: Session) -> str:
    browser: Optional[str] = useragents.UserAgent(session.user_agent).browser
    os: Optional[str] = useragents.UserAgent(session.user_agent).platform

    return (
        browser.title()
        if browser
        else "Unknown" + " on " + os.title()
        if os
        else "Unknown OS"
    )


def local_time(timestamp: str) -> str:
    tzinfo = tz.gettz(flask.g.session.time_zone if flask.g.session.time_zone else "UTC")
    time: datetime = datetime.fromtimestamp(float(timestamp))
    local: datetime = time.astimezone(tzinfo)

    return local.strftime("%c")
