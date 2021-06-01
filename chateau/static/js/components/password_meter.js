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

import '../lib/zxcvbn.js';

const colors = ['darkred', 'red', 'orange', 'yellowgreen', 'green'];

class PasswordMeter extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const meterLength = 5;
        for (let i = 0; i < meterLength; i++) {
            const dot = document.createElement('span');
            dot.textContent = '\u25cf';
            dot.style.display = 'none';
            shadowRoot.append(dot);
        }

        const passwordInputID = this.getAttribute('password-input');
        const passwordInputElement = document.getElementById(passwordInputID);
        passwordInputElement.addEventListener('input', (e) => {
            const result = zxcvbn(passwordInputElement.value);
            const meterIcons = shadowRoot.querySelectorAll('span');
            for (let i = 0; i < meterIcons.length; i++) {
                if (i <= result.score) {
                    meterIcons[i].style.display = 'inline';
                    meterIcons[i].style.color = colors[result.score];
                } else {
                    meterIcons[i].style.display = 'none';
                }
            }
        });
    }
}

customElements.define('password-meter', PasswordMeter);
