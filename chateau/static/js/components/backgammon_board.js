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

const POINT_CX = [120, 190, 260, 330, 400, 470, 630, 700, 770, 840, 910, 980];
const BOARD = {
    width: 1100,
    height: 680,
    padding: 20,
    top: 20,
    middleX: 570,
    middleY: 360,
    bottom: 700,
    leftX: 317,
    rightX: 823,
    trayLeft: 60,
    trayRight: 1080,
};
const DIRECTION = { up: -1, down: 1 };
const CHECKER_FILL = ['white', 'dimgrey'];
const CHECKER_TEXT_FILL = ['black', 'white'];
const CHECKER_STROKE = ['dimgrey', 'white'];
const CHECKER_RADIUS = 28;
const CHECKER_STROKE_WIDTH = 4;
const CHECKER_COMBINED_RADIUS = CHECKER_RADIUS + CHECKER_STROKE_WIDTH / 2;
const MAX_CHECKERS = 5;
const CHECKER_FONT_SIZE = '2rem';
const OFF = { width: 76, height: 16, padding: 4 };
const CUBE = {
    width: 60,
    height: 60,
    padding: 10,
    radius: 8,
    fill: 'black',
    text: 'white',
    fontSize: '2rem',
};
const DIE = {
    width: 60,
    height: 60,
    top: 13,
    middle: 30,
    bottom: 47,
    left: 13,
    right: 47,
    padding: 10,
    radius: 8,
    fill: 'black',
};
const PIP = { radius: 6, fill: 'white' };
const SCORE = {
    x: 1200,
    height: 120,
    fontSize: '4rem',
    fill: ['white', 'dimgrey'],
    stroke: ['dimgrey', 'white'],
    highlight: 'gold',
};
const PIP_COUNT = { offsetY: 32, fill: 'white', fontSize: '1rem' };
const BUTTON = {
    width: 60,
    height: 60,
    padding: 40,
    radius: 8,
    defaultFill: 'black',
    acceptFill: 'green',
    rejectFill: 'red',
    stroke: 'black',
    strokeWidth: 8,
};
const HAMBURGER = {
    width: 80,
    height: 80,
    radius: 8,
    fill: 'grey',
    barWidth: 60,
    barHeight: 10,
    barFill: 'black',
};
const MENU_ITEM = {
    width: 440,
    height: 80,
    radius: 8,
    fill: 'black',
    stroke: 'white',
    resignSingleY: 100,
    resignGammonY: 220,
    resignBackgammonY: 340,
    exitY: 560,
};
const ROLL_DOUBLE_SKIP = {
    width: 200,
    height: 60,
    radius: 8,
    fill: 'black',
    stroke: 'white',
};
const STATUS = {
    color: {
        disconnected: 'red',
        connected: 'green',
    },
};

function b64ToBytes(b64) {
    return Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function bytesToBits(bytes) {
    return bytes
        .map((b) => [...b.toString(2).padStart(8, '0')].reverse().join(''))
        .join('');
}

function bitsToInt(bits, start, end) {
    return parseInt([...bits.slice(start, end)].reverse().join(''), 2);
}

function sumArray(array) {
    return array.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    );
}

function stringifyClock(start, timestamp, turnOwner) {
    if (!turnOwner) {
        const minutes = Math.floor(start / 1000 / 60)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor((start / 1000) % 60)
            .toString()
            .padStart(2, '0');

        return ['', `${minutes}:${seconds}`];
    } else {
        const now = Date.now();
        const elapsed = now - timestamp;
        const delay = Math.max(0, 15000 - elapsed);
        const reserve = delay ? start : Math.max(0, start + 15000 - elapsed);

        delaySeconds = delay ? Math.floor(delay / 1000).toString() : '';
        reserveMinutes = Math.floor(reserve / 1000 / 60)
            .toString()
            .padStart(2, '0');
        reserveSeconds = Math.floor((reserve / 1000) % 60)
            .toString()
            .padStart(2, '0');

        return [delaySeconds, `${reserveMinutes}:${reserveSeconds}`];
    }
}

let template = document.createElement('template');
// prettier-ignore
template.innerHTML = `
    <style>
        :host {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #shareurl p {
            font-weight: bold;
            text-align: center;
            margin-top: 0;
        }

        #shareurl button {
            background: rgb(26, 115, 232);
            border-radius: 0.25rem;
            border: 2px solid rgb(26, 115, 232);
            box-sizing: border-box;
            color: #fff;
            cursor: pointer;
            margin: 0.5rem 0.5rem 0 0.5rem;
            padding: 0.5rem 1rem;
        }

        #shareurl button#leave {
            background: rgb(176 0 32);
            border: 2px solid rgb(176 0 32);
        }

        #shareurl input[type="text"] {
            -webkit-appearance: none;
            border-radius: 0.25rem;
            border: 2px solid rgb(193, 193, 193);
            box-sizing: border-box;
            line-height: normal;
            padding: 0.5rem 1rem;
            text-align: center;
        }

        #shareurl input[type="text"]:focus {
            border-radius: 0.25rem;
            border: 2px solid rgb(77, 144, 254);
            outline-width: 0;
        }

        #shareurl div {
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            justify-content: center;
        }

        #backgammon {
            display: none;
            width: 100%;
            height: 100%;
        }

        text {
            font-weight: bold;
            pointer-events: none;
            user-select: none;
        }

        text.clock {
            fill: white;
            font-size: 2rem;
            text-anchor: middle;
            alignment-baseline: central;
        }
    </style>
    <div id="shareurl">
        <p>Share this URL with a friend to start the game:</p>
        <div>
            <input type="text" id="url" size="${ location.href.length }" value="${ location.href }" readonly>
            <button id="copyurl">Copy</button>
        </div>
        <div>
            <button id="leave">Leave game</button>
        </div>
    </div>
    <svg id="backgammon" viewBox="0 0 1280 720">
        <rect width="1280" height="720" fill="black" />
        <rect id="scoreTop" x="1144" y="${BOARD.top + 4}" width="112" height="112" rx="8" ry="8" stroke-width="8" />
        <rect id="scoreBottom" x="1144" y="${BOARD.bottom - 112 - 4}" width="112" height="112" rx="8" ry="8" stroke-width="8" />
        <circle id="statusTop" cx="1200" cy="160" r="8" fill="${STATUS.color.disconnected}" />
        <circle id="statusBottom" cx="1200" cy="560" r="8" fill="${STATUS.color.disconnected}" />
        <text id="reserveTop" class="clock" x="1200" y="200"></text>
        <text id="delayTop" class="clock" x="1200" y="240"></text>
        <text id="delayBottom" class="clock" x="1200" y="480"></text>
        <text id="reserveBottom" class="clock" x="1200" y="520"></text>
    </svg>
`;

let boardTemplate = document.createElement('template');
// prettier-ignore
boardTemplate.innerHTML = `
    <svg x="${BOARD.padding}" y="${BOARD.padding}" width="${BOARD.width}" height="${BOARD.height}" viewBox="0 0 ${BOARD.width} ${BOARD.height}">
        <rect x="0" y="0" width="80" height="${BOARD.height}" fill="tan" />
        <rect class="field" x="84" y="0" width="426" height="${BOARD.height}" fill="tan" />
        <rect class="field" x="590" y="0" width="426" height="${BOARD.height}" fill="tan" />
        <rect x="1020" y="0" width="80" height="${BOARD.height}" fill="tan" />

        <polygon points="90,0 150,0 ${POINT_CX[0]},300" fill="green" />
        <polygon points="160,0 220,0 ${POINT_CX[1]},300" fill="black" />
        <polygon points="230,0 290,0 ${POINT_CX[2]},300" fill="green" />
        <polygon points="300,0 360,0 ${POINT_CX[3]},300" fill="black" />
        <polygon points="370,0 430,0 ${POINT_CX[4]},300" fill="green" />
        <polygon points="440,0 500,0 ${POINT_CX[5]},300" fill="black" />

        <polygon points="600,0 660,0 ${POINT_CX[6]},300" fill="green" />
        <polygon points="670,0 730,0 ${POINT_CX[7]},300" fill="black" />
        <polygon points="740,0 800,0 ${POINT_CX[8]},300" fill="green" />
        <polygon points="810,0 870,0  ${POINT_CX[9]},300" fill="black" />
        <polygon points="880,0 940,0 ${POINT_CX[10]},300" fill="green" />
        <polygon points="950,0 1010,0 ${POINT_CX[11]},300" fill="black" />

        <polygon points="90,${BOARD.height} 150,${BOARD.height} ${POINT_CX[0]},380" fill="black" />
        <polygon points="160,${BOARD.height} 220,${BOARD.height} ${POINT_CX[1]},380" fill="green" />
        <polygon points="230,${BOARD.height} 290,${BOARD.height} ${POINT_CX[2]},380" fill="black" />
        <polygon points="300,${BOARD.height} 360,${BOARD.height} ${POINT_CX[3]},380" fill="green" />
        <polygon points="370,${BOARD.height} 430,${BOARD.height} ${POINT_CX[4]},380" fill="black" />
        <polygon points="440,${BOARD.height} 500,${BOARD.height} ${POINT_CX[5]},380" fill="green" />

        <polygon points="600,${BOARD.height} 660,${BOARD.height} ${POINT_CX[6]},380" fill="black" />
        <polygon points="670,${BOARD.height} 730,${BOARD.height} ${POINT_CX[7]},380" fill="green" />
        <polygon points="740,${BOARD.height} 800,${BOARD.height} ${POINT_CX[8]},380" fill="black" />
        <polygon points="810,${BOARD.height} 870,${BOARD.height} ${POINT_CX[9]},380" fill="green" />
        <polygon points="880,${BOARD.height} 940,${BOARD.height} ${POINT_CX[10]},380" fill="black" />
        <polygon points="950,${BOARD.height} 1010,${BOARD.height} ${POINT_CX[11]},380" fill="green" />
    </svg>
`;

let hamburgerOpen = document.createElement('template');
// prettier-ignore
hamburgerOpen.innerHTML = `
    <svg width="${HAMBURGER.width}" height="${HAMBURGER.height}" viewBox ="0 0 ${HAMBURGER.width} ${HAMBURGER.height}">
        <rect width="${HAMBURGER.width}" height="${HAMBURGER.height}" rx="${HAMBURGER.radius}" ry="${HAMBURGER.radius}" fill="${HAMBURGER.fill}" />
        <text x="${HAMBURGER.width / 2}" y="${HAMBURGER.height / 2}" fill="${HAMBURGER.barfill}" text-anchor="middle" alignment-baseline="middle" font-size="1.6rem">Menu</text>
    </svg>
`;

let hamburgerClose = document.createElement('template');
// prettier-ignore
hamburgerClose.innerHTML = `
    <svg width="${HAMBURGER.width}" height="${HAMBURGER.height}" viewBox ="0 0 ${HAMBURGER.width} ${HAMBURGER.height}">
        <rect width="${HAMBURGER.width}" height="${HAMBURGER.height}" rx="${HAMBURGER.radius}" ry="${HAMBURGER.radius}" fill="${HAMBURGER.fill}" />
        <path d="M16 16 L64 64" stroke="${HAMBURGER.barFill}" stroke-width="8" />
        <path d="M16 64 L64 16" stroke="${HAMBURGER.barFill}" stroke-width="8" />
    </svg>
`;

let menuTemplate = document.createElement('template');
// prettier-ignore
menuTemplate.innerHTML = `
    <svg x="${BOARD.top}" y="${BOARD.top}" width="1100" height="${BOARD.bottom - BOARD.top}" viewBox ="0 0 1100 ${BOARD.bottom - BOARD.top}">
        <rect width="1100" height="${BOARD.bottom - BOARD.top}" fill="grey" />
    </svg>
`;

let exit = document.createElement('template');
// prettier-ignore
exit.innerHTML = `
    <svg width="${MENU_ITEM.width}" height="${MENU_ITEM.height}" viewBox ="0 0 ${MENU_ITEM.width} ${MENU_ITEM.height}">
        <rect width="${MENU_ITEM.width}" height="${MENU_ITEM.height}" rx="${MENU_ITEM.radius}" ry="${MENU_ITEM.radius}" fill="${MENU_ITEM.fill}" />
        <path d="M30 16 L40 16 L40 22" stroke="grey" stroke-width="4" />
        <path d="M30 64 L40 64 L40 58" stroke="grey" stroke-width="4" />
        <polygon points="8,16 8,64, 30,74, 30,6" fill="white" />
        <path d="M36 40 L56 40" stroke="white" stroke-width="16" />
        <polygon points="54,20 54,60, 72,40" fill="white" />
        <text x="260" y="40" fill="white" text-anchor="middle" alignment-baseline="middle" font-size="2rem">Leave game</text>
    </svg>
`;

let resignSingleTemplate = document.createElement('template');
// prettier-ignore
resignSingleTemplate.innerHTML = `
    <svg width="${MENU_ITEM.width}" height="${MENU_ITEM.height}" viewBox ="0 0 ${MENU_ITEM.width} ${MENU_ITEM.height}">
    <rect width="${MENU_ITEM.width}" height="${MENU_ITEM.height}" rx="${MENU_ITEM.radius}" ry="${MENU_ITEM.radius}" fill="${MENU_ITEM.fill}" />
    <text x="${MENU_ITEM.width / 2}" y="${MENU_ITEM.height / 2}" fill="white" text-anchor="middle" alignment-baseline="middle" font-size="2rem">Resign Single</text>
    </svg>
`;

let resignGammonTemplate = document.createElement('template');
// prettier-ignore
resignGammonTemplate.innerHTML = `
    <svg width="${MENU_ITEM.width}" height="${MENU_ITEM.height}" viewBox ="0 0 ${MENU_ITEM.width} ${MENU_ITEM.height}">
    <rect width="${MENU_ITEM.width}" height="${MENU_ITEM.height}" rx="${MENU_ITEM.radius}" ry="${MENU_ITEM.radius}" fill="${MENU_ITEM.fill}" />
    <text x="${MENU_ITEM.width / 2}" y="${MENU_ITEM.height / 2}" fill="white" text-anchor="middle" alignment-baseline="middle" font-size="2rem">Resign Gammon</text>
    </svg>
`;

let resignBackgammonTemplate = document.createElement('template');
// prettier-ignore
resignBackgammonTemplate.innerHTML = `
    <svg width="${MENU_ITEM.width}" height="${MENU_ITEM.height}" viewBox ="0 0 ${MENU_ITEM.width} ${MENU_ITEM.height}">
    <rect width="${MENU_ITEM.width}" height="${MENU_ITEM.height}" rx="${MENU_ITEM.radius}" ry="${MENU_ITEM.radius}" fill="${MENU_ITEM.fill}" />
    <text x="${MENU_ITEM.width / 2}" y="${MENU_ITEM.height / 2}" fill="white" text-anchor="middle" alignment-baseline="middle" font-size="2rem">Resign Backgammon</text>
    </svg>
`;

let rollButtonTemplate = document.createElement('template');
// prettier-ignore
rollButtonTemplate.innerHTML = `
    <svg width="${ROLL_DOUBLE_SKIP.width}" height="${ROLL_DOUBLE_SKIP.height}" viewBox ="0 0 ${ROLL_DOUBLE_SKIP.width} ${ROLL_DOUBLE_SKIP.height}">
        <rect width="${ROLL_DOUBLE_SKIP.width}" height="${ROLL_DOUBLE_SKIP.height}" rx="${ROLL_DOUBLE_SKIP.radius}" ry="${ROLL_DOUBLE_SKIP.radius}" fill="${ROLL_DOUBLE_SKIP.fill}" />
        <text x="${ROLL_DOUBLE_SKIP.width / 2}" y="${ROLL_DOUBLE_SKIP.height / 2}" fill="gold" text-anchor="middle" alignment-baseline="middle" font-size="2rem">Roll</text>
    </svg>
`;

let doubleButtonTemplate = document.createElement('template');
// prettier-ignore
doubleButtonTemplate.innerHTML = `
    <svg width="${ROLL_DOUBLE_SKIP.width}" height="${ROLL_DOUBLE_SKIP.height}" viewBox ="0 0 ${ROLL_DOUBLE_SKIP.width} ${ROLL_DOUBLE_SKIP.height}">
        <rect width="${ROLL_DOUBLE_SKIP.width}" height="${ROLL_DOUBLE_SKIP.height}" rx="${ROLL_DOUBLE_SKIP.radius}" ry="${ROLL_DOUBLE_SKIP.radius}" fill="${ROLL_DOUBLE_SKIP.fill}" />
        <text x="${ROLL_DOUBLE_SKIP.width / 2}" y="${ROLL_DOUBLE_SKIP.height / 2}" fill="gold" text-anchor="middle" alignment-baseline="middle" font-size="2rem">Double</text>
    </svg>
`;

let skipButtonTemplate = document.createElement('template');
// prettier-ignore
skipButtonTemplate.innerHTML = `
    <svg width="${ROLL_DOUBLE_SKIP.width}" height="${ROLL_DOUBLE_SKIP.height}" viewBox ="0 0 ${ROLL_DOUBLE_SKIP.width} ${ROLL_DOUBLE_SKIP.height}">
        <rect width="${ROLL_DOUBLE_SKIP.width}" height="${ROLL_DOUBLE_SKIP.height}" rx="${ROLL_DOUBLE_SKIP.radius}" ry="${ROLL_DOUBLE_SKIP.radius}" fill="${ROLL_DOUBLE_SKIP.fill}" />
        <text x="${ROLL_DOUBLE_SKIP.width / 2}" y="${ROLL_DOUBLE_SKIP.height / 2}" fill="gold" text-anchor="middle" alignment-baseline="middle" font-size="2rem">Skip</text>
    </svg>
`;

let die_1 = document.createElement('template');
// prettier-ignore
die_1.innerHTML = `
    <svg width="${DIE.width}" height="${DIE.height}" viewBox ="0 0 ${DIE.width} ${DIE.height}">
        <rect width="${DIE.width}" height="${DIE.height}" rx="${DIE.radius}" ry="${DIE.radius}" fill="${DIE.fill}" />
        <circle cx="${DIE.middle}" cy="${DIE.middle}" r="${PIP.radius}" fill="${PIP.fill}" />
    </svg>
`;

let die_2 = document.createElement('template');
// prettier-ignore
die_2.innerHTML = `
    <svg width="${DIE.width}" height="${DIE.height}" viewBox ="0 0 ${DIE.width} ${DIE.height}">
        <rect width="${DIE.width}" height="${DIE.height}" rx="${DIE.radius}" ry="${DIE.radius}" fill="${DIE.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.bottom}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.top}" r="${PIP.radius}" fill="${PIP.fill}" />
    </svg>
`;

let die_3 = document.createElement('template');
// prettier-ignore
die_3.innerHTML = `
    <svg width="${DIE.width}" height="${DIE.height}" viewBox ="0 0 ${DIE.width} ${DIE.height}">
        <rect width="${DIE.width}" height="${DIE.height}" rx="${DIE.radius}" ry="${DIE.radius}" fill="${DIE.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.bottom}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.middle}" cy="${DIE.middle}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.top}" r="${PIP.radius}" fill="${PIP.fill}" />
    </svg>
`;

let die_4 = document.createElement('template');
// prettier-ignore
die_4.innerHTML = `
    <svg width="${DIE.width}" height="${DIE.height}" viewBox ="0 0 ${DIE.width} ${DIE.height}">
        <rect width="${DIE.width}" height="${DIE.height}" rx="${DIE.radius}" ry="${DIE.radius}" fill="${DIE.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.top}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.bottom}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.top}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.bottom}" r="${PIP.radius}" fill="${PIP.fill}" />
    </svg>
`;

let die_5 = document.createElement('template');
// prettier-ignore
die_5.innerHTML = `
    <svg width="${DIE.width}" height="${DIE.height}" viewBox ="0 0 ${DIE.width} ${DIE.height}">
        <rect width="${DIE.width}" height="${DIE.height}" rx="${DIE.radius}" ry="${DIE.radius}" fill="${DIE.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.top}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.bottom}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.middle}" cy="${DIE.middle}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.top}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.bottom}" r="${PIP.radius}" fill="${PIP.fill}" />
    </svg>
`;

let die_6 = document.createElement('template');
// prettier-ignore
die_6.innerHTML = `
    <svg width="${DIE.width}" height="${DIE.height}" viewBox ="0 0 ${DIE.width} ${DIE.height}">
        <rect width="${DIE.width}" height="${DIE.height}" rx="${DIE.radius}" ry="${DIE.radius}" fill="${DIE.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.top}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.middle}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.left}" cy="${DIE.bottom}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.top}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.middle}" r="${PIP.radius}" fill="${PIP.fill}" />
        <circle cx="${DIE.right}" cy="${DIE.bottom}" r="${PIP.radius}" fill="${PIP.fill}" />
    </svg>
`;

let acceptTemplate = document.createElement('template');
// prettier-ignore
acceptTemplate.innerHTML = `
    <svg width="${BUTTON.width}" height="${BUTTON.height}" viewBox ="0 0 ${BUTTON.width} ${BUTTON.height}">
        <rect width="${BUTTON.width}" height="${BUTTON.height}" rx="${BUTTON.radius}" ry="${BUTTON.radius}" fill="${BUTTON.acceptFill}" />
        <path d="M12 30 L30 48 50 12" stroke="${BUTTON.stroke}" stroke-width="${BUTTON.strokeWidth}" fill="none" />
    </svg>
`;

let reject = document.createElement('template');
// prettier-ignore
reject.innerHTML = `
    <svg width="${BUTTON.width}" height="${BUTTON.height}" viewBox ="0 0 ${BUTTON.width} ${BUTTON.height}">
        <rect width="${BUTTON.width}" height="${BUTTON.height}" rx="${BUTTON.radius}" ry="${BUTTON.radius}" fill="${BUTTON.rejectFill}" />
        <circle cx="${BUTTON.width / 2}" cy="${BUTTON.height / 2}" r="22" fill="none" stroke="${BUTTON.stroke}" stroke-width="${BUTTON.strokeWidth}" />
        <path d="M16 16 L44 44" stroke="${BUTTON.stroke}" stroke-width="${BUTTON.strokeWidth}" />
    </svg>
`;

let undoButtonTemplate = document.createElement('template');
// prettier-ignore
undoButtonTemplate.innerHTML = `
    <svg width="${ROLL_DOUBLE_SKIP.width}" height="${ROLL_DOUBLE_SKIP.height}" viewBox ="0 0 ${ROLL_DOUBLE_SKIP.width} ${ROLL_DOUBLE_SKIP.height}">
        <rect width="${ROLL_DOUBLE_SKIP.width}" height="${ROLL_DOUBLE_SKIP.height}" rx="${ROLL_DOUBLE_SKIP.radius}" ry="${ROLL_DOUBLE_SKIP.radius}" fill="${ROLL_DOUBLE_SKIP.fill}" />
        <text x="${ROLL_DOUBLE_SKIP.width / 2}" y="${ROLL_DOUBLE_SKIP.height / 2}" fill="white" text-anchor="middle" alignment-baseline="middle" font-size="2rem">Undo</text>
    </svg>
`;

customElements.define(
    'backgammon-board',
    class extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.menuOpen = false;

            this.connect();
            this.bindEvents();
            this.clock();
        }

        connect() {
            const websocketURL = this.getAttribute('websocketURL');
            this.websocket = new WebSocket(websocketURL, 'game');
        }

        bindEvents() {
            this.shadowRoot
                .querySelector('#copyurl')
                .addEventListener('click', (event) => {
                    const url = this.shadowRoot.querySelector('#url');
                    url.select();
                    document.execCommand('copy');
                });

            this.shadowRoot
                .querySelector('#leave')
                .addEventListener('click', (event) => {
                    this.exit();
                });

            this.websocket.addEventListener('open', (event) => {
                this.websocket.send(JSON.stringify({ opcode: 'connect' }));
            });

            this.websocket.addEventListener('message', (event) => {
                const msg = JSON.parse(event.data);
                console.log(msg);
                switch (msg.code) {
                    case 'close':
                        this.close(msg);
                        break;
                    case 'feedback':
                        this.feedback(msg);
                        break;
                    case 'player':
                        this.player(msg);
                        break;
                    case 'status':
                        this.status(msg);
                        break;
                    case 'update':
                        this.update(msg);
                        break;
                }
            });
        }

        clock() {
            this.intervalId = window.setInterval(() => {
                if (this.match?.gameState == 1) {
                    const [delay0, reserve0] = stringifyClock(
                        this.time0,
                        this.timestamp,
                        this.match.turn == 0
                    );
                    const [delay1, reserve1] = stringifyClock(
                        this.time1,
                        this.timestamp,
                        this.match.turn == 1
                    );

                    const svg = this.shadowRoot.querySelector('svg');

                    const delay0Element =
                        this.player == 0
                            ? svg.querySelector('#delayBottom')
                            : svg.querySelector('#delayTop');
                    const reserve0Element =
                        this.player == 0
                            ? svg.querySelector('#reserveBottom')
                            : svg.querySelector('#reserveTop');

                    const delay1Element =
                        this.player == 0
                            ? svg.querySelector('#delayTop')
                            : svg.querySelector('#delayBottom');
                    const reserve1Element =
                        this.player == 0
                            ? svg.querySelector('#reserveTop')
                            : svg.querySelector('#reserveBottom');

                    delay0Element.textContent = delay0;
                    reserve0Element.textContent = reserve0;
                    delay1Element.textContent = delay1;
                    reserve1Element.textContent = reserve1;

                    if (reserve0 == '00:00' || reserve1 == '00:00')
                        this.stopClock();
                }
            }, 100);
        }

        stopClock() {
            window.clearInterval(this.intervalId);
        }

        close(msg) {
            this.websocket.close(1000);
            window.location.href = '/';
        }

        feedback(msg) {
            this.websocket.close(1000);
            window.location.href = '/feedback/nps';
        }

        player(msg) {
            this.player = msg.player;
        }

        status(msg) {
            const svg = this.shadowRoot.querySelector('svg');

            const status0 =
                this.player == 0
                    ? svg.querySelector('#statusBottom')
                    : svg.querySelector('#statusTop');
            const status1 =
                this.player == 0
                    ? svg.querySelector('#statusTop')
                    : svg.querySelector('#statusBottom');

            [0, 1].forEach((player) => {
                const color = msg[player]
                    ? STATUS.color[msg[player]]
                    : STATUS.color.disconnected;
                if (player == 0) status0.setAttribute('fill', color);
                else status1.setAttribute('fill', color);
            });
        }

        update(msg) {
            this.gnubgID = msg.id;
            let game = this.decode(this.gnubgID);
            this.match = game.match;
            this.position = game.position;
            console.log(this.match, this.position);
            this.time0 = parseInt(msg.time0);
            this.time1 = parseInt(msg.time1);
            this.timestamp = parseInt(msg.timestamp);
            this.plays = null;
            this.reversedPlays = null;
            if (
                this.match.gameState == 1 &&
                !this.match.resign &&
                this.match.dice[0] != 0 &&
                this.player == this.match.player
            ) {
                [this.plays, this.reversedPlays] = this.generatePlays();
                console.log(this.plays);
            }
            this.moveList = [];
            this.clear();
            this.draw();
        }

        decode(id) {
            const [positionId, matchId] = id.split(':');
            const position = this.decodePosition(positionId);
            const match = this.decodeMatch(matchId);

            return { position: position, match: match };
        }

        decodePosition(positionId) {
            const positionBytes = b64ToBytes(positionId);
            const positionKey = bytesToBits(positionBytes);
            const checkers = positionKey
                .split(0)
                .slice(0, 50)
                .map((pos) => sumArray([...pos].map((n) => parseInt(n))));
            const opponentPoints = checkers.slice(0, 24).reverse();
            const opponentBar = checkers[24];
            const opponentOff = 15 - sumArray(opponentPoints) - opponentBar;
            const playerPoints = checkers.slice(25, 49);
            const playerBar = checkers[49];
            const playerOff = 15 - sumArray(playerPoints) - playerBar;
            const boardPoints = playerPoints.map(
                (n, i) => n - opponentPoints[i]
            );

            return {
                boardPoints: boardPoints,
                playerBar: playerBar,
                playerOff: playerOff,
                opponentBar: opponentBar,
                opponentOff: opponentOff,
            };
        }

        decodeMatch(matchId) {
            const matchBytes = b64ToBytes(matchId);
            const matchKey = bytesToBits(matchBytes);

            return {
                cubeValue: 2 ** bitsToInt(matchKey, 0, 4),
                cubeHolder: bitsToInt(matchKey, 4, 6),
                player: bitsToInt(matchKey, 6, 7),
                crawford: Boolean(bitsToInt(matchKey, 7, 8)),
                gameState: bitsToInt(matchKey, 8, 11),
                turn: bitsToInt(matchKey, 11, 12),
                double: Boolean(bitsToInt(matchKey, 12, 13)),
                resign: bitsToInt(matchKey, 13, 15),
                dice: [
                    bitsToInt(matchKey, 15, 18),
                    bitsToInt(matchKey, 18, 21),
                ],
                length: bitsToInt(matchKey, 21, 36),
                player0Score: bitsToInt(matchKey, 36, 51),
                player1Score: bitsToInt(matchKey, 51, 66),
            };
        }

        generatePlays() {
            function enter([...boardPoints], pips, playerBar) {
                let destination = 24 - pips;
                if (boardPoints[destination] >= -1) {
                    playerBar--;

                    if (boardPoints[destination] == -1)
                        boardPoints[destination] = 1;
                    else boardPoints[destination]++;

                    return [boardPoints, playerBar, destination];
                }

                return [null, null, null];
            }

            function home(boardPoints) {
                return boardPoints.slice(0, 6);
            }

            function playerHome(boardPoints) {
                return home(boardPoints).map((numCheckers) =>
                    numCheckers > 0 ? numCheckers : 0
                );
            }

            function off([...boardPoints], point, pips, playerOff) {
                if (boardPoints[point] > 0) {
                    let destination = point - pips;
                    if (destination < 0) {
                        let numCheckersHigherPoints = sumArray(
                            playerHome(boardPoints).slice(point + 1, 6)
                        );
                        if (destination == -1 || numCheckersHigherPoints == 0) {
                            boardPoints[point]--;
                            playerOff++;

                            return [boardPoints, playerOff, 'off'];
                        }
                    } else if (boardPoints[destination] >= -1) {
                        boardPoints[point]--;

                        if (boardPoints[destination] == -1)
                            boardPoints[destination] = 1;
                        else boardPoints[destination]++;

                        return [boardPoints, playerOff, destination];
                    }
                }

                return [null, null, null];
            }

            function move([...boardPoints], point, pips) {
                if (boardPoints[point] > 0) {
                    let destination = point - pips;
                    if (destination >= 0 && boardPoints[destination] >= -1) {
                        boardPoints[point]--;

                        if (boardPoints[destination] == -1)
                            boardPoints[destination] = 1;
                        else boardPoints[destination]++;

                        return [boardPoints, destination];
                    }
                }

                return [null, null];
            }

            function generate(
                boardPoints,
                playerBar,
                playerOff,
                dice,
                die = 0,
                moves = [],
                plays = []
            ) {
                let pips = dice[die];

                let newBoardPoints, newPlayerBar, newPlayerOff, destination;
                if (pips) {
                    if (playerBar > 0) {
                        [newBoardPoints, newPlayerBar, destination] = enter(
                            boardPoints,
                            pips,
                            playerBar
                        );
                        if (newBoardPoints)
                            generate(
                                newBoardPoints,
                                newPlayerBar,
                                playerOff,
                                dice,
                                die + 1,
                                [
                                    ...moves,
                                    {
                                        pips: pips,
                                        source: 'bar',
                                        destination: destination,
                                    },
                                ],
                                plays
                            );
                    } else if (
                        sumArray(playerHome(boardPoints)) + playerOff ==
                        15
                    ) {
                        home(boardPoints).forEach((numCheckers, point) => {
                            [newBoardPoints, newPlayerOff, destination] = off(
                                boardPoints,
                                point,
                                pips,
                                playerOff
                            );
                            if (newBoardPoints)
                                generate(
                                    newBoardPoints,
                                    playerBar,
                                    newPlayerOff,
                                    dice,
                                    die + 1,
                                    [
                                        ...moves,
                                        {
                                            pips: pips,
                                            source: point,
                                            destination: destination,
                                        },
                                    ],
                                    plays
                                );
                        });
                    } else {
                        boardPoints.forEach((checkers, point) => {
                            [newBoardPoints, destination] = move(
                                boardPoints,
                                point,
                                pips
                            );
                            if (newBoardPoints)
                                generate(
                                    newBoardPoints,
                                    playerBar,
                                    playerOff,
                                    dice,
                                    die + 1,
                                    [
                                        ...moves,
                                        {
                                            pips: pips,
                                            source: point,
                                            destination: destination,
                                        },
                                    ],
                                    plays
                                );
                        });
                    }
                }

                if (moves.length) plays.push(moves);

                return plays;
            }

            const doubles = this.match.dice[0] == this.match.dice[1];
            const dice = doubles
                ? [...this.match.dice, ...this.match.dice]
                : [...this.match.dice];

            let plays = generate(
                [...this.position.boardPoints],
                this.position.playerBar,
                this.position.playerOff,
                dice
            );

            let reversedPlays = generate(
                [...this.position.boardPoints],
                this.position.playerBar,
                this.position.playerOff,
                dice.reverse()
            );

            let maxMoves = Math.max(
                ...plays.map((play) => play.length),
                ...reversedPlays.map((play) => play.length)
            );
            if (maxMoves == 1) {
                let maxPips = Math.max(...this.match.dice);

                let higherPlays = plays.filter(
                    (play) => play[0].pips == maxPips
                );
                if (higherPlays.length) plays = higherPlays;

                let higherReversedPlays = reversedPlays.filter(
                    (play) => play[0].pips == maxPips
                );
                if (higherReversedPlays.length)
                    reversedPlays = higherReversedPlays;
            } else {
                plays = plays.filter((play) => play.length == maxMoves);
                reversedPlays = reversedPlays.filter(
                    (play) => play.length == maxMoves
                );
            }

            function tree(plays) {
                return plays.reduce((tree, play) => {
                    let prev = tree;
                    for (let depth = 0; depth < play.length; depth++) {
                        let move = play[depth];
                        prev.moves = prev.moves || {};
                        let node = (prev.moves[move.source] =
                            prev.moves[move.source] || {});
                        node.pips = move.pips;
                        node.destination = move.destination;
                        prev = node;
                    }
                    return tree;
                }, {});
            }

            return [tree(plays), tree(reversedPlays)];
        }

        draw() {
            if (this.match.gameState != 0) {
                this.shadowRoot.querySelector('#shareurl').style.display =
                    'none';
                this.shadowRoot.querySelector('#backgammon').style.display =
                    'block';
                this.drawHamburger();
                if (this.menuOpen) {
                    this.drawMenu();
                    this.drawExit();
                    this.drawResign();
                } else {
                    this.drawBoard();
                    this.drawPoints();
                    this.drawBar();
                    this.drawOff();
                    this.drawCube();
                    this.drawPipCount();
                    if (
                        this.match.gameState == 1 &&
                        this.player == this.match.turn &&
                        this.match.dice[0] == 0 &&
                        !this.match.double &&
                        !this.match.resign
                    )
                        this.drawRollDouble();
                    if (
                        this.match.dice[0] != 0 &&
                        this.match.gameState == 1 &&
                        !this.match.resign
                    ) {
                        this.drawDice();
                        this.drawUndo();
                    }
                    if (
                        this.match.gameState == 1 &&
                        !this.match.resign &&
                        this.player == this.match.turn &&
                        this.match.dice[0] != 0 &&
                        !this.plays?.moves &&
                        !this.reversedPlays?.moves
                    )
                        this.drawSkip();
                    if (this.match.gameState == 2) this.drawGameOver();
                    if (this.match.resign && this.player == this.match.turn)
                        this.drawAcceptRejectResign();
                }
                this.drawScore();
            }
        }

        drawHamburger() {
            const svg = this.shadowRoot.querySelector('svg');

            let hamburger = this.menuOpen
                ? hamburgerClose.content.cloneNode(true)
                : hamburgerOpen.content.cloneNode(true);
            hamburger.firstElementChild.setAttribute(
                'x',
                SCORE.x - HAMBURGER.width / 2
            );
            hamburger.firstElementChild.setAttribute(
                'y',
                BOARD.middleY - HAMBURGER.height / 2
            );
            hamburger.firstElementChild.className.baseVal = 'foreground';
            hamburger.firstElementChild.addEventListener('click', (event) => {
                this.toggleMenu(event);
            });
            svg.appendChild(hamburger);
        }

        drawMenu() {
            const svg = this.shadowRoot.querySelector('svg');

            let menu = menuTemplate.content.cloneNode(true);
            menu.firstElementChild.className.baseVal = 'foreground';
            svg.appendChild(menu);
        }

        drawBoard() {
            const svg = this.shadowRoot.querySelector('svg');

            let board = boardTemplate.content.cloneNode(true);
            board.firstElementChild.className.baseVal = 'foreground';
            svg.appendChild(board);
        }

        drawPoints() {
            let annotatedPoints = this.position.boardPoints.map(
                (numCheckers, index) => {
                    const player = (numCheckers) => {
                        if (this.match.player == 0)
                            return numCheckers > 0 ? 0 : 1;
                        else return numCheckers > 0 ? 1 : 0;
                    };

                    return {
                        index: index,
                        player: numCheckers == 0 ? null : player(numCheckers),
                        numCheckers: Math.abs(numCheckers),
                    };
                }
            );

            const normalizedPoints =
                this.match.player == 0
                    ? annotatedPoints
                    : annotatedPoints.reverse();

            const displayPoints =
                this.player == 0
                    ? normalizedPoints.reverse()
                    : normalizedPoints;

            const halves = {
                top: displayPoints.slice(0, displayPoints.length / 2).reverse(),
                bottom: displayPoints.slice(displayPoints.length / 2),
            };

            for (const half in halves) {
                let direction = half == 'top' ? DIRECTION.down : DIRECTION.up;
                let cy = BOARD[half] + CHECKER_COMBINED_RADIUS * direction;

                halves[half].forEach((point, index) => {
                    if (point.numCheckers != 0) {
                        let cx = POINT_CX[index] + BOARD.padding;
                        this.drawCheckers(
                            point.index,
                            point.player,
                            point.numCheckers,
                            cx,
                            cy,
                            direction
                        );
                    }
                });
            }
        }

        drawBar() {
            const numBarPlayer0 =
                this.match.player == 0
                    ? this.position.playerBar
                    : this.position.opponentBar;
            if (numBarPlayer0 != 0)
                this.drawCheckers(
                    'bar',
                    0,
                    numBarPlayer0,
                    BOARD.middleX,
                    this.player == 0
                        ? BOARD.bottom - CHECKER_COMBINED_RADIUS
                        : BOARD.top + CHECKER_COMBINED_RADIUS,
                    this.player == 0 ? DIRECTION.up : DIRECTION.down
                );

            const numBarPlayer1 =
                this.match.player == 1
                    ? this.position.playerBar
                    : this.position.opponentBar;
            if (numBarPlayer1 != 0)
                this.drawCheckers(
                    'bar',
                    1,
                    numBarPlayer1,
                    BOARD.middleX,
                    this.player == 0
                        ? BOARD.top + CHECKER_COMBINED_RADIUS
                        : BOARD.bottom - CHECKER_COMBINED_RADIUS,
                    this.player == 0 ? DIRECTION.down : DIRECTION.up
                );
        }

        drawCheckers(location, player, num, cx, cy, direction) {
            const svg = this.shadowRoot.querySelector('svg');

            let fill = CHECKER_FILL[player];
            let stroke = CHECKER_STROKE[player];

            for (let i = 1; i <= num; i++) {
                let checker = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'circle'
                );
                checker.setAttribute('cx', cx);
                checker.setAttribute('cy', cy);
                checker.setAttribute('r', CHECKER_RADIUS);
                checker.setAttribute('fill', fill);
                if (this.plays?.moves && location in this.plays.moves)
                    checker.setAttribute('stroke', 'gold');
                else checker.setAttribute('stroke', stroke);
                checker.setAttribute('stroke-width', CHECKER_STROKE_WIDTH);
                checker.dataset.location = location;
                checker.dataset.player = player;
                checker.addEventListener('click', (event) => {
                    this.move(event);
                });
                checker.className.baseVal = 'foreground';
                svg.appendChild(checker);

                if (i == MAX_CHECKERS) {
                    let textFill = CHECKER_TEXT_FILL[player];
                    let remaining_checkers = num - i;
                    if (remaining_checkers > 0) {
                        let label = document.createElementNS(
                            'http://www.w3.org/2000/svg',
                            'text'
                        );
                        label.setAttribute('x', cx);
                        label.setAttribute('y', cy);
                        label.setAttribute('text-anchor', 'middle');
                        label.setAttribute('alignment-baseline', 'middle');
                        label.setAttribute('fill', textFill);
                        label.setAttribute('font-size', CHECKER_FONT_SIZE);
                        let text = document.createTextNode(remaining_checkers);
                        label.appendChild(text);
                        label.className.baseVal = 'foreground';
                        svg.appendChild(label);
                    }
                    break;
                }

                cy += CHECKER_COMBINED_RADIUS * 2 * direction;
            }
        }

        drawOff() {
            const numOffPlayer0 =
                this.match.player == 0
                    ? this.position.playerOff
                    : this.position.opponentOff;
            if (numOffPlayer0 > 0)
                this.drawTray(
                    0,
                    numOffPlayer0,
                    this.player == 0 ? false : true
                );

            const numOffPlayer1 =
                this.match.player == 1
                    ? this.position.playerOff
                    : this.position.opponentOff;
            if (numOffPlayer1 > 0)
                this.drawTray(
                    1,
                    numOffPlayer1,
                    this.player == 0 ? true : false
                );
        }

        drawTray(player, num, top) {
            const svg = this.shadowRoot.querySelector('svg');

            let direction = top ? DIRECTION.down : DIRECTION.up;
            let fill = CHECKER_FILL[player];
            let x = BOARD.trayRight - OFF.width / 2;
            let y;
            if (top) y = BOARD.top + OFF.padding;
            else y = BOARD.bottom - (OFF.height + OFF.padding);

            do {
                let off = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'rect'
                );
                off.setAttribute('x', x);
                off.setAttribute('y', y);
                off.setAttribute('width', OFF.width);
                off.setAttribute('height', OFF.height);
                off.setAttribute('fill', fill);
                off.className.baseVal = 'foreground';
                svg.appendChild(off);

                num--;
                y += (OFF.height + OFF.padding) * direction;
            } while (num > 0);
        }

        drawCube() {
            const svg = this.shadowRoot.querySelector('svg');

            if (this.match.crawford) {
                let label = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'text'
                );
                label.setAttribute('x', BOARD.trayLeft);
                label.setAttribute('y', BOARD.middleY);
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('alignment-baseline', 'middle');
                label.setAttribute('fill', 'black');
                label.setAttribute('font-size', '1rem');
                let text = document.createTextNode('Crawford');
                label.appendChild(text);
                label.className.baseVal = 'foreground';
                svg.appendChild(label);
            } else {
                let cube = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'rect'
                );
                const x = !this.match.double
                    ? BOARD.trayLeft
                    : BOARD.rightX + CUBE.width / 2 + BUTTON.padding;
                cube.setAttribute('x', x - CUBE.width / 2);

                const topY = BOARD.top + CUBE.padding;
                const bottomY = BOARD.bottom - (CUBE.height + CUBE.padding);
                let y;
                if (this.match.cubeHolder == 3 || this.match.double)
                    y = BOARD.middleY - CUBE.height / 2;
                else if (this.match.cubeHolder == 0)
                    y = this.player == 0 ? bottomY : topY;
                else y = this.player == 0 ? topY : bottomY;
                cube.setAttribute('y', y);

                cube.setAttribute('rx', CUBE.radius);
                cube.setAttribute('ry', CUBE.radius);
                cube.setAttribute('width', CUBE.width);
                cube.setAttribute('height', CUBE.height);
                cube.setAttribute('fill', CUBE.fill);
                if (this.match.double)
                    cube.addEventListener('click', (event) => {
                        this.acceptDouble(event);
                    });
                cube.className.baseVal = 'foreground';
                svg.appendChild(cube);
                const cubeValue = this.match.double
                    ? this.match.cubeValue * 2
                    : this.match.cubeValue == 1
                    ? 64
                    : this.match.cubeValue;
                let label = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'text'
                );
                label.setAttribute('x', x);
                label.setAttribute('y', y + CUBE.height / 2);
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('alignment-baseline', 'middle');
                label.setAttribute('fill', CUBE.text);
                label.setAttribute('font-size', CUBE.fontSize);
                let text = document.createTextNode(cubeValue);
                label.appendChild(text);
                label.className.baseVal = 'foreground';
                svg.appendChild(label);

                if (this.match.double) {
                    let rejectButton = reject.content.cloneNode(true);
                    rejectButton.firstElementChild.setAttribute(
                        'x',
                        x - BUTTON.width * 1.5 - BUTTON.padding * 2
                    );
                    rejectButton.firstElementChild.setAttribute('y', y);
                    rejectButton.firstElementChild.className.baseVal =
                        'foreground';
                    rejectButton.firstElementChild.addEventListener(
                        'click',
                        (event) => {
                            this.rejectDouble(event);
                        }
                    );
                    svg.appendChild(rejectButton);
                }
            }
        }

        drawAcceptRejectResign() {
            const svg = this.shadowRoot.querySelector('svg');

            function typeText(resignType) {
                switch (resignType) {
                    case 1:
                        return 'single';
                        break;
                    case 2:
                        return 'gammon';
                        break;
                    case 3:
                        return 'backgammon';
                        break;
                }
            }

            let question = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'text'
            );
            question.setAttribute('x', BOARD.leftX);
            question.setAttribute('y', BOARD.middleY);
            question.setAttribute('text-anchor', 'middle');
            question.setAttribute('alignment-baseline', 'middle');
            question.setAttribute('font-size', '1.4rem');
            let text = document.createTextNode(
                `Accept ${typeText(this.match.resign)} resignation?`
            );
            question.appendChild(text);
            question.className.baseVal = 'foreground';
            svg.appendChild(question);

            const y = BOARD.middleY - BUTTON.height / 2;

            let acceptButton = acceptTemplate.content.cloneNode(true);
            acceptButton.firstElementChild.setAttribute(
                'x',
                BOARD.rightX + BUTTON.padding
            );
            acceptButton.firstElementChild.setAttribute('y', y);
            acceptButton.firstElementChild.className.baseVal = 'foreground';
            acceptButton.firstElementChild.addEventListener(
                'click',
                (event) => {
                    this.acceptResignation(event);
                }
            );
            svg.appendChild(acceptButton);

            let rejectButton = reject.content.cloneNode(true);
            rejectButton.firstElementChild.setAttribute(
                'x',
                BOARD.rightX - BUTTON.width - BUTTON.padding
            );
            rejectButton.firstElementChild.setAttribute('y', y);
            rejectButton.firstElementChild.className.baseVal = 'foreground';
            rejectButton.firstElementChild.addEventListener(
                'click',
                (event) => {
                    this.rejectResignation(event);
                }
            );
            svg.appendChild(rejectButton);
        }

        drawScore() {
            const svg = this.shadowRoot.querySelector('svg');

            const score0 =
                this.player == 0
                    ? svg.querySelector('#scoreBottom')
                    : svg.querySelector('#scoreTop');
            const score1 =
                this.player == 0
                    ? svg.querySelector('#scoreTop')
                    : svg.querySelector('#scoreBottom');

            console.log();

            [this.match.player0Score, this.match.player1Score].forEach(
                (score, player) => {
                    let label = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        'text'
                    );
                    label.setAttribute('x', SCORE.x);
                    label.setAttribute(
                        'y',
                        player == 0
                            ? parseInt(score0.getAttribute('y')) +
                                  parseInt(score0.getAttribute('height')) / 2
                            : parseInt(score1.getAttribute('y')) +
                                  parseInt(score1.getAttribute('height')) / 2
                    );
                    label.setAttribute('text-anchor', 'middle');
                    label.setAttribute('alignment-baseline', 'middle');
                    label.setAttribute('fill', CHECKER_TEXT_FILL[player]);
                    label.setAttribute('font-size', SCORE.fontSize);
                    let text = document.createTextNode(score);
                    label.appendChild(text);
                    label.className.baseVal = 'foreground';
                    svg.appendChild(label);
                }
            );

            score0.setAttribute('fill', SCORE.fill[0]);
            score0.setAttribute('stroke', SCORE.stroke[0]);

            score1.setAttribute('fill', SCORE.fill[1]);
            score1.setAttribute('stroke', SCORE.stroke[1]);

            if (this.match.gameState > 0) {
                if (this.match.turn == 0) {
                    score0.setAttribute('stroke', SCORE.highlight);
                    score1.setAttribute('stroke', SCORE.stroke[1]);
                } else if (this.match.turn == 1) {
                    score1.setAttribute('stroke', SCORE.highlight);
                    score0.setAttribute('stroke', SCORE.stroke[0]);
                }
            }
        }

        drawPipCount() {
            const svg = this.shadowRoot.querySelector('svg');
            const pipCountPlayer = this.position.boardPoints
                .map((n) => (n > 0 ? n : 0))
                .reduce(
                    (count, numCheckers, point) =>
                        count + (point + 1) * numCheckers,
                    0
                );
            const pipCountOpponent = this.position.boardPoints
                .map((n) => (n < 0 ? Math.abs(n) : 0))
                .reverse()
                .reduce(
                    (count, numCheckers, point) =>
                        count + (point + 1) * numCheckers,
                    0
                );

            const pipCount0 =
                this.match.player == 0 ? pipCountPlayer : pipCountOpponent;
            const pipCount1 =
                this.match.player == 1 ? pipCountPlayer : pipCountOpponent;

            [pipCount0, pipCount1].forEach((pipCount, player) => {
                let label = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'text'
                );
                label.setAttribute('x', BOARD.middleX);
                const topY = BOARD.middleY - PIP_COUNT.offsetY;
                const bottomY = BOARD.middleY + PIP_COUNT.offsetY;
                label.setAttribute(
                    'y',
                    player == 0
                        ? this.player == 0
                            ? bottomY
                            : topY
                        : this.player == 0
                        ? topY
                        : bottomY
                );
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('alignment-baseline', 'middle');
                label.setAttribute('fill', PIP_COUNT.fill);
                label.setAttribute('font-size', PIP_COUNT.fontSize);
                let text = document.createTextNode(pipCount);
                label.appendChild(text);
                label.className.baseVal = 'foreground';
                svg.appendChild(label);
            });
        }

        drawRollDouble() {
            const svg = this.shadowRoot.querySelector('svg');

            let rollButton = rollButtonTemplate.content.cloneNode(true);
            rollButton.firstElementChild.setAttribute(
                'x',
                BOARD.rightX - ROLL_DOUBLE_SKIP.width / 2
            );
            rollButton.firstElementChild.setAttribute(
                'y',
                BOARD.middleY - ROLL_DOUBLE_SKIP.height / 2
            );
            rollButton.firstElementChild.className.baseVal = 'foreground';
            rollButton.firstElementChild.addEventListener('click', (event) => {
                this.roll(event);
            });
            svg.appendChild(rollButton);

            if (
                this.match[`player${this.match.player}Score`] +
                    this.match.cubeValue <
                    this.match.length &&
                !this.match.crawford &&
                (this.match.cubeHolder == 3 ||
                    this.match.cubeHolder == this.match.player)
            ) {
                let doubleButton = doubleButtonTemplate.content.cloneNode(true);
                doubleButton.firstElementChild.setAttribute(
                    'x',
                    BOARD.leftX - ROLL_DOUBLE_SKIP.width / 2
                );
                doubleButton.firstElementChild.setAttribute(
                    'y',
                    BOARD.middleY - ROLL_DOUBLE_SKIP.height / 2
                );
                doubleButton.firstElementChild.className.baseVal = 'foreground';
                doubleButton.firstElementChild.addEventListener(
                    'click',
                    (event) => {
                        this.double(event);
                    }
                );
                svg.appendChild(doubleButton);
            }
        }

        drawDice() {
            const svg = this.shadowRoot.querySelector('svg');

            this.match.dice.forEach((pips, index) => {
                let x;
                if (index == 0) x = BOARD.rightX - (DIE.width + DIE.padding);
                else x = BOARD.rightX + DIE.padding;

                let die;
                switch (pips) {
                    case 1:
                        die = die_1.content.cloneNode(true);
                        break;
                    case 2:
                        die = die_2.content.cloneNode(true);
                        break;
                    case 3:
                        die = die_3.content.cloneNode(true);
                        break;
                    case 4:
                        die = die_4.content.cloneNode(true);
                        break;
                    case 5:
                        die = die_5.content.cloneNode(true);
                        break;
                    case 6:
                        die = die_6.content.cloneNode(true);
                        break;
                }
                die.firstElementChild.setAttribute('x', x);
                die.firstElementChild.setAttribute(
                    'y',
                    BOARD.middleY - DIE.height / 2
                );
                die.firstElementChild.className.baseVal = 'foreground';
                die.firstElementChild.addEventListener('click', (event) => {
                    this.reverseDice(event);
                });
                svg.appendChild(die);
            });
        }

        drawUndo() {
            if (this.moveList.length) {
                const svg = this.shadowRoot.querySelector('svg');

                let undoButton = undoButtonTemplate.content.cloneNode(true);
                undoButton.firstElementChild.setAttribute(
                    'x',
                    BOARD.leftX - ROLL_DOUBLE_SKIP.width / 2
                );
                undoButton.firstElementChild.setAttribute(
                    'y',
                    BOARD.middleY - ROLL_DOUBLE_SKIP.height / 2
                );
                undoButton.firstElementChild.className.baseVal = 'foreground';
                undoButton.firstElementChild.addEventListener(
                    'click',
                    (event) => {
                        this.undo(event);
                    }
                );
                svg.appendChild(undoButton);
            }
        }

        drawSkip() {
            const svg = this.shadowRoot.querySelector('svg');

            let skipButton = skipButtonTemplate.content.cloneNode(true);
            skipButton.firstElementChild.setAttribute(
                'x',
                (this.match.player == 0 ? BOARD.rightX : BOARD.leftX) -
                    ROLL_DOUBLE_SKIP.width / 2
            );
            skipButton.firstElementChild.setAttribute(
                'y',
                BOARD.middleY - ROLL_DOUBLE_SKIP.height / 2
            );
            skipButton.firstElementChild.className.baseVal = 'foreground';
            skipButton.firstElementChild.addEventListener('click', (event) => {
                this.skip(event);
            });
            svg.appendChild(skipButton);
        }

        drawGameOver() {
            const svg = this.shadowRoot.querySelector('svg');

            ['GAME', 'OVER'].forEach((word, index) => {
                let label = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'text'
                );
                label.setAttribute(
                    'x',
                    index == 0 ? BOARD.leftX : BOARD.rightX
                );
                label.setAttribute('y', BOARD.middleY);
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('alignment-baseline', 'middle');
                label.setAttribute('font-size', '4rem');
                let text = document.createTextNode(word);
                label.appendChild(text);
                label.className.baseVal = 'foreground';
                svg.appendChild(label);
            });
        }

        drawExit() {
            const svg = this.shadowRoot.querySelector('svg');

            let exitButton = exit.content.cloneNode(true);
            exitButton.firstElementChild.setAttribute(
                'x',
                BOARD.middleX - MENU_ITEM.width / 2
            );
            exitButton.firstElementChild.setAttribute('y', MENU_ITEM.exitY);
            exitButton.firstElementChild.className.baseVal = 'foreground';
            exitButton.firstElementChild.addEventListener('click', (event) => {
                this.exit(event);
            });
            svg.appendChild(exitButton);
        }

        drawResign() {
            const svg = this.shadowRoot.querySelector('svg');

            const x = BOARD.middleX - MENU_ITEM.width / 2;

            let resignSingle = resignSingleTemplate.content.cloneNode(true);
            resignSingle.firstElementChild.setAttribute('x', x);
            resignSingle.firstElementChild.setAttribute(
                'y',
                MENU_ITEM.resignSingleY
            );

            let resignGammon = resignGammonTemplate.content.cloneNode(true);
            resignGammon.firstElementChild.setAttribute('x', x);
            resignGammon.firstElementChild.setAttribute(
                'y',
                MENU_ITEM.resignGammonY
            );

            let resignBackgammon =
                resignBackgammonTemplate.content.cloneNode(true);
            resignBackgammon.firstElementChild.setAttribute('x', x);
            resignBackgammon.firstElementChild.setAttribute(
                'y',
                MENU_ITEM.resignBackgammonY
            );

            [resignSingle, resignGammon, resignBackgammon].forEach(
                (button, index) => {
                    button.firstElementChild.className.baseVal = 'foreground';
                    button.firstElementChild.addEventListener(
                        'click',
                        (event) => {
                            this.resign(event, index + 1);
                        }
                    );
                    svg.appendChild(button);
                }
            );
        }

        toggleMenu(event) {
            this.menuOpen = this.menuOpen ? false : true;
            this.clear();
            this.draw();
        }

        clear() {
            const svg = this.shadowRoot.querySelector('svg');
            const foreground = svg.querySelectorAll('.foreground');
            foreground.forEach((e) => e.parentNode.removeChild(e));
        }

        move(event) {
            const source = event.target.dataset.location;
            const player = event.target.dataset.player;

            if (player != this.match.player || this.player != this.match.player)
                return;

            const moves = this.plays?.moves;
            if (moves) {
                if (moves[source]) {
                    const destination = moves[source].destination;

                    if (source == 'bar') this.position.playerBar--;
                    else this.position.boardPoints[Number.parseInt(source)]--;

                    if (Number.isInteger(destination)) {
                        if (this.position.boardPoints[destination] >= 0)
                            this.position.boardPoints[destination]++;
                        else {
                            this.position.boardPoints[destination] = 1;
                            this.position.opponentBar++;
                        }
                    } else this.position.playerOff++;

                    this.moveList.push(Number.parseInt(source), destination);
                    this.plays = this.plays.moves[source];

                    console.log(this.plays);

                    if (!this.plays?.moves)
                        this.websocket.send(
                            JSON.stringify({
                                opcode: 'move',
                                move: this.moveList.map((n) =>
                                    Number.isInteger(n) ? n : null
                                ),
                            })
                        );

                    this.clear();
                    this.draw();
                }
            }
        }

        roll(event) {
            if (this.player != this.match.player) return;

            if (this.match.dice[0] != 0) return;

            this.websocket.send(JSON.stringify({ opcode: 'roll' }));
        }

        reverseDice(event) {
            if (this.player != this.match.player) return;

            if (this.moveList.length) return;

            this.match.dice.reverse();
            [this.plays, this.reversedPlays] = [this.reversedPlays, this.plays];
            console.log(this.plays);

            this.clear();
            this.draw();
        }

        undo(event) {
            if (this.player != this.match.player) return;

            if (!this.moveList.length) return;

            let game = this.decode(this.gnubgID);
            this.match = game.match;
            this.position = game.position;
            this.plays = null;
            this.reversedPlays = null;
            [this.plays, this.reversedPlays] = this.generatePlays();
            this.moveList = [];
            this.clear();
            this.draw();
        }

        double(event) {
            if (this.player != this.match.player) return;

            if (
                this.match.cubeHolder != 3 &&
                this.match.cubeHolder != this.match.player
            )
                return;

            if (this.match.dice[0] != 0) return;

            if (this.match.double == true) return;

            this.websocket.send(JSON.stringify({ opcode: 'double' }));
        }

        acceptDouble(event) {
            if (this.player != this.match.turn) return;

            this.websocket.send(JSON.stringify({ opcode: 'accept' }));
        }

        rejectDouble(event) {
            if (this.player != this.match.turn) return;

            if (!this.match.double) return;

            this.websocket.send(JSON.stringify({ opcode: 'reject' }));
        }

        resign(event, resign_type) {
            if (this.player != this.match.player) return;

            if (this.match.resign) return;

            this.websocket.send(
                JSON.stringify({ opcode: 'resign', resign: resign_type })
            );

            this.toggleMenu();
        }

        acceptResignation(event) {
            if (this.player != this.match.turn) return;

            if (!this.match.resign) return;

            this.websocket.send(JSON.stringify({ opcode: 'accept' }));
        }

        rejectResignation(event) {
            if (this.player != this.match.turn) return;

            if (!this.match.resign) return;

            this.websocket.send(JSON.stringify({ opcode: 'reject' }));
        }

        skip() {
            this.websocket.send(JSON.stringify({ opcode: 'skip' }));
        }

        exit(event) {
            this.websocket.send(JSON.stringify({ opcode: 'exit' }));
        }
    }
);
