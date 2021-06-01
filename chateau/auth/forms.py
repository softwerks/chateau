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


def create_login_form(
    *, password_max_length: int, tzdata_min_length: int, tzdata_max_length: int
):
    class LoginForm(flask_wtf.FlaskForm):
        username = wtforms.StringField(
            "Email", [wtforms.validators.DataRequired(), wtforms.validators.Email()]
        )
        password = wtforms.PasswordField(
            "Password",
            [
                wtforms.validators.DataRequired(),
                wtforms.validators.Length(max=password_max_length),
            ],
        )
        time_zone = wtforms.HiddenField(
            "Timezone",
            [
                wtforms.validators.DataRequired(),
                wtforms.validators.Length(min=tzdata_min_length, max=tzdata_max_length),
            ],
        )
        recaptcha = flask_wtf.RecaptchaField()

    return LoginForm()


def create_signup_form(
    *,
    password_min_length: int,
    password_max_length: int,
):
    class SignupForm(flask_wtf.FlaskForm):
        username = wtforms.StringField(
            "Email", [wtforms.validators.DataRequired(), wtforms.validators.Email()]
        )
        password = wtforms.PasswordField(
            "Password",
            [
                wtforms.validators.DataRequired(),
                wtforms.validators.Length(
                    min=password_min_length, max=password_max_length
                ),
            ],
        )
        optin = wtforms.BooleanField("Sign up for the Backgammon Network newsletter")
        recaptcha = flask_wtf.RecaptchaField()

    return SignupForm()


class ResetForm(flask_wtf.FlaskForm):
    username = wtforms.StringField(
        "Email", [wtforms.validators.DataRequired(), wtforms.validators.Email()]
    )
    recaptcha = flask_wtf.RecaptchaField()
