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

import flask

import chateau.auth


def create_app() -> flask.app.Flask:
    app = flask.Flask(__name__, instance_relative_config=True)

    app.config.from_object("chateau.config")
    app.config.from_pyfile("config.py", silent=True)

    @app.route("/")
    def index() -> str:
        return flask.render_template("index.html")

    app.register_blueprint(chateau.auth.blueprint, url_prefix="/auth")

    return app
