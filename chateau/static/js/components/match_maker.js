// Copyright 2021 Softwerks LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let template = document.createElement('template');
template.innerHTML = `
    <style>
        .spinner {
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            --sk-size: 4rem;
            --sk-color: #f25f5c;
        }

        /* SpinKit - https://github.com/tobiasahlin/SpinKit */

        .sk-center {
            margin: auto;
        }

        .sk-circle {
            width: var(--sk-size);
            height: var(--sk-size);
            position: relative;
        }

        .sk-circle-dot {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }

        .sk-circle-dot:before {
            content: "";
            display: block;
            width: 15%;
            height: 15%;
            background-color: var(--sk-color);
            border-radius: 100%;
            animation: sk-circle 1.2s infinite ease-in-out both;
        }

        .sk-circle-dot:nth-child(1) {
            transform: rotate(30deg);
        }
        .sk-circle-dot:nth-child(2) {
            transform: rotate(60deg);
        }
        .sk-circle-dot:nth-child(3) {
            transform: rotate(90deg);
        }
        .sk-circle-dot:nth-child(4) {
            transform: rotate(120deg);
        }
        .sk-circle-dot:nth-child(5) {
            transform: rotate(150deg);
        }
        .sk-circle-dot:nth-child(6) {
            transform: rotate(180deg);
        }
        .sk-circle-dot:nth-child(7) {
            transform: rotate(210deg);
        }
        .sk-circle-dot:nth-child(8) {
            transform: rotate(240deg);
        }
        .sk-circle-dot:nth-child(9) {
            transform: rotate(270deg);
        }
        .sk-circle-dot:nth-child(10) {
            transform: rotate(300deg);
        }
        .sk-circle-dot:nth-child(11) {
            transform: rotate(330deg);
        }
        .sk-circle-dot:nth-child(1):before {
            animation-delay: -1.1s;
        }
        .sk-circle-dot:nth-child(2):before {
            animation-delay: -1s;
        }
        .sk-circle-dot:nth-child(3):before {
            animation-delay: -0.9s;
        }
        .sk-circle-dot:nth-child(4):before {
            animation-delay: -0.8s;
        }
        .sk-circle-dot:nth-child(5):before {
            animation-delay: -0.7s;
        }
        .sk-circle-dot:nth-child(6):before {
            animation-delay: -0.6s;
        }
        .sk-circle-dot:nth-child(7):before {
            animation-delay: -0.5s;
        }
        .sk-circle-dot:nth-child(8):before {
            animation-delay: -0.4s;
        }
        .sk-circle-dot:nth-child(9):before {
            animation-delay: -0.3s;
        }
        .sk-circle-dot:nth-child(10):before {
            animation-delay: -0.2s;
        }
        .sk-circle-dot:nth-child(11):before {
            animation-delay: -0.1s;
        }

        @keyframes sk-circle {
            0%,
            80%,
            100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }
</style>
<div class="spinner">
    <div class="sk-circle">
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
        <div class="sk-circle-dot"></div>
    </div>
</div>
`;

customElements.define(
    'match-maker',
    class extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.connect();

            this.bindEvents();
        }

        connect() {
            const websocketURL = this.getAttribute('websocketURL');
            this.websocket = new WebSocket(websocketURL, 'match');
        }

        bindEvents() {
            this.websocket.addEventListener('message', (event) => {
                const msg = JSON.parse(event.data);
                switch (msg.code) {
                    case 'found':
                        this.redirect(msg);
                        break;
                }
            });
        }

        found() {
            console.log(msg);
        }
    }
);
