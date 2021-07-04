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

import flask_wtf
import wtforms
import wtforms.validators


class NPSForm(flask_wtf.FlaskForm):
    nps = wtforms.RadioField(
        label="How likely is it that you would recommend the Backgammon Network to a friend?",
        choices=[
            (1, "1"),
            (2, "2"),
            (3, "3"),
            (4, "4"),
            (5, "5"),
            (6, "6"),
            (7, "7"),
            (8, "8"),
            (9, "9"),
            (10, "10"),
        ],
        coerce=int,
        validators=[
            wtforms.validators.DataRequired(),
            wtforms.validators.NumberRange(1, 10),
        ],
    )
    comments = wtforms.TextAreaField(
        label="Any other feedback? (Optional)",
        validators=[wtforms.validators.Optional(), wtforms.validators.Length(max=511)],
    )
