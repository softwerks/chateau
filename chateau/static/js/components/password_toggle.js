// Copyright 2020 Softwerks LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class PasswordToggle extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});

        const button = document.createElement('button');
        button.type = 'button';
        button.tabIndex = -1;
        button.innerHTML = 'Show';
        shadowRoot.append(button);

        button.addEventListener('click', e => {
            const inputID = this.getAttribute('password-input');
            const inputElement = document.getElementById(inputID);
            if (inputElement.type === 'password') {
                button.innerHTML = 'Hide';
                inputElement.type = 'text';
            } else {
                button.innerHTML = 'Show';
                inputElement.type = 'password';
            }
            inputElement.focus();
        });
    }
}

customElements.define('password-toggle', PasswordToggle);
