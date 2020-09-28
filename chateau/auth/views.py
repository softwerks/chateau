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

from typing import Union

import flask
import werkzeug

from chateau.auth import blueprint
import chateau.auth.forms as forms


@blueprint.route("login", methods=["GET", "POST"])
def login() -> Union[werkzeug.wrappers.Response, str]:
    form = forms.LoginForm()
    if form.validate_on_submit():
        return flask.redirect(flask.url_for("index"))
    return flask.render_template("auth/login.html", form=form)
