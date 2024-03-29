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

import flask
import psycopg2.pool
from redis import Redis

# import chateau.auth
import chateau.database
import chateau.feedback
import chateau.game
import chateau.stats
import chateau.play
import chateau.redis
import chateau.session

# import chateau.settings


def create_app() -> flask.app.Flask:
    app: flask.app.Flask = flask.Flask(__name__, instance_relative_config=True)

    app.config.from_object("chateau.config")
    app.config.from_pyfile("config.py", silent=True)

    database_connection_pool: psycopg2.pool.ThreadedConnectionPool = (
        psycopg2.pool.ThreadedConnectionPool(
            1, 16, app.config["DATABASE_DSN"], cursor_factory=psycopg2.extras.DictCursor
        )
    )
    chateau.database.init_app(app, database_connection_pool)

    redis: Redis = Redis.from_url(app.config["SESSION_URL"], decode_responses=True)
    chateau.redis.init_app(app, redis)

    chateau.session.init_app(app)

    chateau.stats.init_app(app)

    @app.route("/")
    def index() -> str:
        return flask.render_template("index.html")

    # app.register_blueprint(chateau.auth.blueprint, url_prefix="/auth")
    app.register_blueprint(chateau.feedback.blueprint, url_prefix="/feedback")
    app.register_blueprint(chateau.game.blueprint, url_prefix="/game")
    app.register_blueprint(chateau.stats.blueprint, url_prefix="/stats")
    app.register_blueprint(chateau.play.blueprint, url_prefix="/play")
    # app.register_blueprint(chateau.settings.blueprint, url_prefix="/settings")

    return app
