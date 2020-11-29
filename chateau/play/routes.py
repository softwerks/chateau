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
import uuid

import flask
import werkzeug

from chateau.play import blueprint


@blueprint.route("custom")
def custom() -> Union[werkzeug.wrappers.Response, str]:
    game_id: uuid.UUID = flask.g.session.data.game_id
    if game_id is None:
        game_id = uuid.uuid4()
        flask.g.session.set_game_id(game_id)
    return flask.redirect(flask.url_for("play.game", game_id=game_id))


@blueprint.route("<uuid:game_id>")
def game(game_id: uuid.UUID) -> Union[werkzeug.wrappers.Response, str]:
    return flask.render_template("play/game.html")
