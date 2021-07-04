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

from typing import Tuple, Union
import urllib.parse

import flask
import flask_wtf
import werkzeug

from chateau.feedback import blueprint
from chateau.feedback import forms


@blueprint.route("nps", methods=["GET", "POST"])
def nps() -> Union[werkzeug.wrappers.Response, str]:
    form: flask_wtf.FlaskForm = forms.NPSForm()

    if form.validate_on_submit():
        nps: int = form.nps.data
        comments: str = form.comments.data

        return flask.redirect(flask.url_for("index"))

    return flask.render_template("feedback/nps.html", form=form)
