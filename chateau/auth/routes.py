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

from typing import Optional, Union

import flask
import flask_wtf
import werkzeug

from chateau.auth import blueprint
from chateau.auth import forms
from chateau import database
from chateau import session


@blueprint.route("login", methods=["GET", "POST"])
def login() -> Union[werkzeug.wrappers.Response, str]:
    password_is_valid: bool
    user_id: Optional[int]
    error: Optional[str] = None

    form: flask_wtf.FlaskForm = forms.create_login_form(
        password_max_length=flask.current_app.config["PASSWORD_MAX_LENGTH"],
        tzdata_min_length=flask.current_app.config["TZDATA_MIN_LENGTH"],
        tzdata_max_length=flask.current_app.config["TZDATA_MAX_LENGTH"],
    )

    if form.validate_on_submit():
        try:
            username: str = form.username.data
            password: str = form.password.data

            password_is_valid, user_id = database.auth.validate_password(
                username=username, password=password
            )

            if password_is_valid:
                time_zone: str = form.time_zone.data

                session.new(user_id, time_zone)

                return flask.redirect(flask.url_for("index"))
            else:
                error = "Invalid email or password."
        except database.DatabaseError:
            flask.abort(500)

    return flask.render_template("auth/login.html", form=form, error=error)


@blueprint.route("logout")
def logout() -> werkzeug.wrappers.Response:
    flask.g.session.delete()

    return flask.redirect(flask.url_for("index"))


@blueprint.route("signup", methods=["GET", "POST"])
def signup() -> Union[werkzeug.wrappers.Response, str]:
    form: flask_wtf.FlaskForm = forms.create_signup_form(
        password_min_length=flask.current_app.config["PASSWORD_MIN_LENGTH"],
        password_max_length=flask.current_app.config["PASSWORD_MAX_LENGTH"],
    )

    if form.validate_on_submit():
        try:
            database.auth.create_user(form.username.data, form.password.data)
        except database.DatabaseError:
            flask.abort(500)

        flask.flash(form.username.data)

        return flask.redirect(flask.url_for("index"))

    return flask.render_template("auth/signup.html", form=form)


@blueprint.route("reset", methods=["GET", "POST"])
def reset() -> Union[werkzeug.wrappers.Response, str]:
    form: flask_wtf.FlaskForm = forms.ResetForm()

    if form.validate_on_submit():
        return flask.redirect(flask.url_for("index"))

    return flask.render_template("auth/reset.html", form=form)
