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

import flask_wtf
import wtforms
import wtforms.validators

PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 64
TZDATA_MIN_LENGTH = 3
TZDATA_MAX_LENGTH = 29  # https://en.wikipedia.org/wiki/Tz_database#Names_of_time_zones


class LoginForm(flask_wtf.FlaskForm):
    username = wtforms.StringField(
        "Email", [wtforms.validators.DataRequired(), wtforms.validators.Email()]
    )
    password = wtforms.PasswordField(
        "Password",
        [
            wtforms.validators.DataRequired(),
            wtforms.validators.Length(max=PASSWORD_MAX_LENGTH),
        ],
    )
    timezone = wtforms.HiddenField(
        "Timezone",
        [
            wtforms.validators.DataRequired(),
            wtforms.validators.Length(min=TZDATA_MIN_LENGTH, max=TZDATA_MAX_LENGTH),
        ],
    )
    recaptcha = flask_wtf.RecaptchaField()


class SignupForm(flask_wtf.FlaskForm):
    username = wtforms.StringField(
        "Email", [wtforms.validators.DataRequired(), wtforms.validators.Email()]
    )
    password = wtforms.PasswordField(
        "Password",
        [
            wtforms.validators.DataRequired(),
            wtforms.validators.Length(min=PASSWORD_MIN_LENGTH, max=PASSWORD_MAX_LENGTH),
        ],
    )
    recaptcha = flask_wtf.RecaptchaField()


class ResetForm(flask_wtf.FlaskForm):
    username = wtforms.StringField(
        "Email", [wtforms.validators.DataRequired(), wtforms.validators.Email()]
    )
    recaptcha = flask_wtf.RecaptchaField()
