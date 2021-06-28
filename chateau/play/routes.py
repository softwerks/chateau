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

import secrets
from typing import Optional, Union

import backgammon
import flask
import werkzeug

from chateau.play import blueprint
from chateau import websocket


@blueprint.route("")
def menu() -> str:
    return flask.render_template("play/menu.html")


@blueprint.route("match")
def match() -> str:
    return flask.render_template(
        "play/match.html", websocket_url=websocket.url(f"match")
    )


@blueprint.route("custom")
def custom() -> Union[werkzeug.wrappers.Response, str]:
    game_id: Optional[str] = flask.g.session.game_id
    if game_id is None:
        game_id = new_custom_game()
    return flask.redirect(flask.url_for("game.game", game_id=game_id), code=303)


def new_custom_game() -> str:
    game_id: str = secrets.token_urlsafe(9)

    position: str = backgammon.backgammon.STARTING_POSITION_ID
    match: str = backgammon.backgammon.STARTING_MATCH_ID

    flask.g.redis.hset(
        f"game:{game_id}", mapping={"position": position, "match": match}
    )

    return game_id
