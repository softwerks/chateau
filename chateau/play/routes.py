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

import functools
import secrets
from typing import Callable, Optional, Union

import flask
import werkzeug

from chateau.play import blueprint
from chateau import websocket

STARTING_POSITION_ID = "4HPwATDgc/ABMA"
STARTING_MATCH_ID = "cAgAAAAAAAAA"


def _redirect_to_game(func: Callable) -> Callable:
    @functools.wraps(func)
    def wrapper(*args, **kwargs) -> Callable:
        game_id: Optional[str] = flask.g.session.game_id

        if game_id is None:
            return func(*args, **kwargs)
        else:
            return flask.redirect(flask.url_for("game.game", game_id=game_id), code=303)

    return wrapper


@blueprint.route("")
@_redirect_to_game
def menu() -> str:
    return flask.render_template("play/menu.html")


@blueprint.route("match")
@_redirect_to_game
def match() -> str:
    return flask.render_template(
        "play/match.html", websocket_url=websocket.url(f"match")
    )


@blueprint.route("custom")
@_redirect_to_game
def custom() -> Union[werkzeug.wrappers.Response, str]:
    return flask.redirect(
        flask.url_for("game.game", game_id=new_custom_game()), code=303
    )


def new_custom_game() -> str:
    game_id: str = secrets.token_urlsafe(9)

    flask.g.redis.hset(
        f"game:{game_id}",
        mapping={"position": STARTING_POSITION_ID, "match": STARTING_MATCH_ID},
    )

    return game_id
