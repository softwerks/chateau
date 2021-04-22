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

const CHECKER_0 = '🔴';
const CHECKER_1 = '🔵';
const HIGHLIGHT_0 = 'crimson';
const HIGHLIGHT_1 = 'cornflowerblue';
const CHECKER_ROWS = 10;
const DICE = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const POINT_CX = [150, 230, 310, 390, 470, 550, 730, 810, 890, 970, 1050, 1130];
const BOARD = {
    top: 20,
    middleX: 640,
    middleY: 360,
    bottom: 700,
    leftX: 352,
    rightX: 928,
    trayLeft: 60,
    trayRight: 1220,
};
const DIRECTION = { up: -1, down: 1 };
const CHECKER_FILL = ['white', 'dimgrey'];
const CHECKER_STROKE = ['dimgrey', 'white'];
const CHECKER_RADIUS = 28;
const CHECKER_STROKE_WIDTH = 4;
const CHECKER_COMBINED_RADIUS = CHECKER_RADIUS + CHECKER_STROKE_WIDTH / 2;
const MAX_CHECKERS = 5;
const OFF = { width: 76, height: 16, padding: 4 };
const CUBE = {
    width: 60,
    height: 60,
    padding: 10,
    radius: 8,
    fill: 'black',
    text: 'white',
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

let template = document.createElement('template');
// prettier-ignore
template.innerHTML = `
    <style>
        :host {
            align-items: center;
            display: flex;
            flex-direction: column;
        }

        text {
            font-weight: bold;
            font-size: 2rem;
            pointer-events: none;
        }
    </style>
    <svg id="backgammon" viewBox="0 0 1280 720">
        <rect width="1280" height="720" fill="black" />
        <rect x="20" y="${BOARD.top}" width="80" height="${BOARD.bottom - BOARD.top}" fill="tan" />
        <rect x="104" y="${BOARD.top}" width="496" height="${BOARD.bottom - BOARD.top}" fill="tan" />
        <rect x="680" y="${BOARD.top}" width="496" height="${BOARD.bottom - BOARD.top}" fill="tan" />
        <rect x="1180" y="${BOARD.top}" width="80" height="${BOARD.bottom - BOARD.top}" fill="tan" />

        <polygon points="120,${BOARD.top} 180,${BOARD.top} ${POINT_CX[0]},320" fill="green" />
        <polygon points="200,${BOARD.top} 260,${BOARD.top} ${POINT_CX[1]},320" fill="black" />
        <polygon points="280,${BOARD.top} 340,${BOARD.top} ${POINT_CX[2]},320" fill="green" />
        <polygon points="360,${BOARD.top} 420,${BOARD.top} ${POINT_CX[3]},320" fill="black" />
        <polygon points="440,${BOARD.top} 500,${BOARD.top} ${POINT_CX[4]},320" fill="green" />
        <polygon points="520,${BOARD.top} 580,${BOARD.top} ${POINT_CX[5]},320" fill="black" />

        <polygon points="700,${BOARD.top} 760,${BOARD.top} ${POINT_CX[6]},320" fill="green" />
        <polygon points="780,${BOARD.top} 840,${BOARD.top} ${POINT_CX[7]},320" fill="black" />
        <polygon points="860,${BOARD.top} 920,${BOARD.top} ${POINT_CX[8]},320" fill="green" />
        <polygon points="940,${BOARD.top} 1000,${BOARD.top}  ${POINT_CX[9]},320" fill="black" />
        <polygon points="1020,${BOARD.top} 1080,${BOARD.top} ${POINT_CX[10]},320" fill="green" />
        <polygon points="1100,${BOARD.top} 1160,20 ${POINT_CX[11]},320" fill="black" />

        <polygon points="120,${BOARD.bottom} 180,${BOARD.bottom} ${POINT_CX[0]},400" fill="black" />
        <polygon points="200,${BOARD.bottom} 260,${BOARD.bottom} ${POINT_CX[1]},400" fill="green" />
        <polygon points="280,${BOARD.bottom} 340,${BOARD.bottom} ${POINT_CX[2]},400" fill="black" />
        <polygon points="360,${BOARD.bottom} 420,${BOARD.bottom} ${POINT_CX[3]},400" fill="green" />
        <polygon points="440,${BOARD.bottom} 500,${BOARD.bottom} ${POINT_CX[4]},400" fill="black" />
        <polygon points="520,${BOARD.bottom} 580,${BOARD.bottom} ${POINT_CX[5]},400" fill="green" />

        <polygon points="700,${BOARD.bottom} 760,${BOARD.bottom} ${POINT_CX[6]},400" fill="black" />
        <polygon points="780,${BOARD.bottom} 840,${BOARD.bottom} ${POINT_CX[7]},400" fill="green" />
        <polygon points="860,${BOARD.bottom} 920,${BOARD.bottom} ${POINT_CX[8]},400" fill="black" />
        <polygon points="940,${BOARD.bottom} 1000,${BOARD.bottom} ${POINT_CX[9]},400" fill="green" />
        <polygon points="1020,${BOARD.bottom} 1080,${BOARD.bottom} ${POINT_CX[10]},400" fill="black" />
        <polygon points="1100,${BOARD.bottom} 1160,${BOARD.bottom} ${POINT_CX[11]},400" fill="green" />
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

customElements.define(
    'backgammon-board',
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
            this.websocket = new WebSocket(websocketURL);
        }

        bindEvents() {
            this.websocket.addEventListener('open', (event) => {
                this.websocket.send(JSON.stringify({ opcode: 'join' }));
            });

            this.websocket.addEventListener('message', (event) => {
                const msg = JSON.parse(event.data);
                switch (msg.code) {
                    case 'player':
                        this.player = msg.player;
                        break;
                    case 'update':
                        let game = this.decode(msg.id);
                        this.match = game.match;
                        this.position = game.position;
                        this.draw();
                        break;
                }
            });
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
                cube_value: 2 ** bitsToInt(matchKey, 0, 4),
                cube_holder: bitsToInt(matchKey, 4, 6),
                player: bitsToInt(matchKey, 6, 7),
                crawford: Boolean(bitsToInt(matchKey, 7, 8)),
                game_state: bitsToInt(matchKey, 8, 11),
                turn: bitsToInt(matchKey, 11, 12),
                double: Boolean(bitsToInt(matchKey, 12, 13)),
                resign: bitsToInt(matchKey, 13, 15),
                dice: [
                    bitsToInt(matchKey, 15, 18),
                    bitsToInt(matchKey, 18, 21),
                ],
                length: bitsToInt(matchKey, 21, 36),
                player_0_score: bitsToInt(matchKey, 36, 51),
                player_1_score: bitsToInt(matchKey, 51, 66),
            };
        }

        draw() {
            this.drawPoints();
            this.drawBar();
            this.drawOff();
            this.drawCube();
            this.drawDice();
        }

        drawPoints() {
            let normalized_points;
            if (this.match.player == 0)
                normalized_points = this.position.boardPoints;
            else
                normalized_points = this.position.boardPoints
                    .map((n) => (n != 0 ? -n : n))
                    .reverse();

            const halves = {
                top: normalized_points
                    .slice(0, normalized_points.length / 2)
                    .reverse(),
                bottom: normalized_points.slice(normalized_points.length / 2),
            };

            for (const half in halves) {
                let direction = half == 'top' ? DIRECTION.down : DIRECTION.up;
                let cy = BOARD[half] + CHECKER_COMBINED_RADIUS * direction;

                halves[half].forEach((numCheckers, index) => {
                    if (numCheckers != 0) {
                        let player = numCheckers > 0 ? 0 : 1;
                        let num = Math.abs(numCheckers);
                        let cx = POINT_CX[index];
                        this.drawCheckers(player, num, cx, cy, direction);
                    }
                });
            }
        }

        drawBar() {
            const numBarPlayer0 =
                this.match.player == 0
                    ? this.position.player_bar
                    : this.position.opponent_bar;
            if (numBarPlayer0 != 0)
                this.drawCheckers(
                    0,
                    numBarPlayer0,
                    BOARD.middleX,
                    BOARD.top + CHECKER_COMBINED_RADIUS,
                    DIRECTION.down
                );

            const numBarPlayer1 =
                this.match.player == 1
                    ? this.position.player_bar
                    : this.position.opponent_bar;
            if (numBarPlayer1 != 0)
                this.drawCheckers(
                    1,
                    numBarPlayer1,
                    BOARD.middleX,
                    BOARD.bottom - CHECKER_COMBINED_RADIUS,
                    DIRECTION.up
                );
        }

        drawCheckers(player, num, cx, cy, direction) {
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
                checker.setAttribute('stroke', stroke);
                checker.setAttribute('stroke-width', CHECKER_STROKE_WIDTH);
                svg.appendChild(checker);

                if (i == MAX_CHECKERS) {
                    let remaining_checkers = num - i;
                    if (remaining_checkers > 0) {
                        let label = document.createElementNS(
                            'http://www.w3.org/2000/svg',
                            'text'
                        );
                        label.setAttribute('x', cx);
                        label.setAttribute('y', cy);
                        label.setAttribute('text-anchor', 'middleX');
                        label.setAttribute('alignment-baseline', 'middleX');
                        label.setAttribute('fill', 'black');
                        let text = document.createTextNode(remaining_checkers);
                        label.appendChild(text);
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
                    ? this.match.player_off
                    : this.match.opponent_off;
            if (numOffPlayer0 > 0) this.drawTray(0, numOffPlayer0);

            const numOffPlayer1 =
                this.match.player == 1
                    ? this.match.player_off
                    : this.match.opponent_off;
            if (numOffPlayer1 > 0) this.drawTray(1, numOffPlayer0);
        }

        drawTray(player, num) {
            const svg = this.shadowRoot.querySelector('svg');

            let direction = player == 0 ? DIRECTION.down : DIRECTION.up;
            let fill = CHECKER_FILL[player];
            let x = BOARD.trayRight - OFF.width / 2;
            let y;
            if (player == 0) y = BOARD.top + OFF.padding;
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
                svg.appendChild(off);

                num--;
                y += (OFF.height + OFF.padding) * direction;
            } while (num > 0);
        }

        drawCube() {
            const svg = this.shadowRoot.querySelector('svg');

            let y;
            if (this.match.cube_holder == 3)
                y = BOARD.middleY - CUBE.height / 2;
            else if (this.match.cube_holder == 0) y = BOARD.top + CUBE.padding;
            else y = BOARD.bottom - (CUBE.height + CUBE.padding);
            let cube = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'rect'
            );
            cube.setAttribute('x', BOARD.trayLeft - CUBE.width / 2);
            cube.setAttribute('y', y);
            cube.setAttribute('rx', CUBE.radius);
            cube.setAttribute('ry', CUBE.radius);
            cube.setAttribute('width', CUBE.width);
            cube.setAttribute('height', CUBE.height);
            cube.setAttribute('fill', CUBE.fill);
            svg.appendChild(cube);
            const cubeValue =
                this.match.cube_holder == 3
                    ? 64
                    : Math.pow(2, this.match.cube_value);
            let label = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'text'
            );
            label.setAttribute('x', BOARD.trayLeft);
            label.setAttribute('y', y + CUBE.height / 2);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('alignment-baseline', 'middle');
            label.setAttribute('fill', CUBE.text);
            let text = document.createTextNode(cubeValue);
            label.appendChild(text);
            svg.appendChild(label);
        }

        drawDice() {
            const svg = this.shadowRoot.querySelector('svg');

            this.match.dice.forEach((pips, index) => {
                let x;
                if (index == 0)
                    x =
                        (this.match.player == 0 ? BOARD.leftX : BOARD.rightX) -
                        (DIE.width + DIE.padding);
                else
                    x =
                        (this.match.player == 0 ? BOARD.leftX : BOARD.rightX) +
                        DIE.padding;
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
                svg.appendChild(die);
            });
        }
    }
);
