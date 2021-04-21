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

let template = document.createElement('template');
// prettier-ignore
template.innerHTML = `
    <style>
        :host {
            align-items: center;
            display: flex;
            flex-direction: column;
        }

        .board {
            margin: 0.5rem 0 0.5rem 0;
        }

        table {
            border-collapse: collapse;
            border: 1px solid darkgrey;
            table-layout: fixed;
        }

        tr:nth-child(7) {
            height: 2.25rem;
        }

        td {
            height: 1.25rem;
            text-align: center;
            user-select: none;
            vertical-align: middleX;
            width: 2.1rem;
            padding: 0;
        }

        td:first-child {
            border-right: 1px solid darkgrey;
        }

        td:last-child {
            border-left: 1px solid darkgrey;
        }

        .bar {
            background: lightgrey;
        }

        .num {
            background: darkgrey;
            color: rgb(248, 248, 248);
            font-weight: bold;
            padding: 0.5rem 0 0.5rem 0;
        }

        .die {
            font-size: 2rem;
        }

        .cube {
            font-weight: bold;
        }

        .controls {
            display: flex;
            justify-content: space-between;
            width: 32rem;
        }

        .controls button {
            background: lightgrey;
            border-radius: 0.25rem;
            border: 2px solid darkgrey;
            cursor: pointer;
            font-size: 1rem;
            font: inherit;
            height: 3rem;
            width: 3rem;
        }

        .controls button:disabled {
            cursor: not-allowed;
        }

        .controls button:enabled {
            border-color: grey;
        }

        .controls button:hover:enabled {
            background: darkgrey;
        }

        text {
            font-weight: bold;
            font-size: 2rem;
            pointer-events: none;
        }
    </style>
    <div class="board"></div>
    <div class="controls">
        <button id="undo" title="Undo" disabled>❌</button>
        <button id="double" title="Double" disabled>🔳</button>
        <button id="play" title="Play" disabled>👍</button>
        <button id="roll" title="Roll" disabled>🎲</button>
        <button id="resign" title="Resign" disabled>🏳️</button>
    </div>
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

            let style = document.createElement('style');
            this.shadowRoot.append(style);
            this.styleSheet = style.sheet;

            const websocketURL = this.getAttribute('websocketURL');
            this.websocket = new WebSocket(websocketURL);

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
                        this.game = JSON.parse(msg.game);
                        console.log(this.game);
                        this.reset();
                        break;
                }
            });

            this.shadowRoot
                .querySelector('#undo')
                .addEventListener('click', (event) => {
                    event.target.blur();
                    this.undo();
                });

            this.shadowRoot
                .querySelector('#play')
                .addEventListener('click', (event) => {
                    event.target.blur();
                    this.play();
                });

            this.shadowRoot
                .querySelector('#roll')
                .addEventListener('click', (event) => {
                    event.target.blur();
                    this.roll();
                });

            this.shadowRoot
                .querySelector('#resign')
                .addEventListener('click', (event) => {
                    event.target.blur();
                    this.resign();
                });

            document.addEventListener('keydown', (event) => {
                switch (event.key) {
                    case 'Enter':
                        this.play();
                        break;
                    case 'Escape':
                        this.deselect();
                        break;
                    case 'z':
                        if (event.ctrlKey) this.undo();
                        break;
                }
            });
        }

        reset() {
            this.match = JSON.parse(JSON.stringify(this.game.match));
            this.position = JSON.parse(JSON.stringify(this.game.position));
            this.moves = new Array(0);
            this.deselect();
            this.render();
            this.draw();
        }

        draw() {
            const svg = this.shadowRoot.querySelector('svg');

            function drawCheckers(player, num, cx, cy, direction) {
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
                            let text = document.createTextNode(
                                remaining_checkers
                            );
                            label.appendChild(text);
                            svg.appendChild(label);
                        }
                        break;
                    }

                    cy += CHECKER_COMBINED_RADIUS * 2 * direction;
                }
            }

            let normalized_points;
            if (this.match.player == 0)
                normalized_points = this.position.board_points;
            else
                normalized_points = this.position.board_points
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
                        drawCheckers(player, num, cx, cy, direction);
                    }
                });
            }

            const numBarPlayer0 =
                this.match.player == 0
                    ? this.position.player_bar
                    : this.position.opponent_bar;
            if (numBarPlayer0 != 0)
                drawCheckers(
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
                drawCheckers(
                    1,
                    numBarPlayer1,
                    BOARD.middleX,
                    BOARD.bottom - CHECKER_COMBINED_RADIUS,
                    DIRECTION.up
                );

            function drawOff(player, num) {
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

            const numOffPlayer0 =
                this.match.player == 0
                    ? this.match.player_off
                    : this.match.opponent_off;
            if (numOffPlayer0 > 0) drawOff(0, numOffPlayer0);
            const numOffPlayer1 =
                this.match.player == 1
                    ? this.match.player_off
                    : this.match.opponent_off;
            if (numOffPlayer1 > 0) drawOff(1, numOffPlayer0);

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

            console.log(svg);
        }

        render() {
            let board = [];

            board.push(this.header());
            board.push(
                ...this.enumerate_checkers(
                    this.match.player,
                    this.position.board_points
                )
            );
            board.push(this.footer());

            function annotate_points() {
                for (let row = 1; row <= CHECKER_ROWS; row++) {
                    for (let col = 0; col < board[row].length; col++) {
                        if (row <= CHECKER_ROWS / 2)
                            board[row][col] = {
                                value: board[row][col],
                                data: {
                                    type: 'point',
                                    point: board[0][col].value,
                                    ...(board[0][col].data?.player !=
                                        undefined && {
                                        player: board[0][col].data.player,
                                    }),
                                },
                            };
                        else
                            board[row][col] = {
                                value: board[row][col],
                                data: {
                                    type: 'point',
                                    point: board[board.length - 1][col].value,
                                    ...(board[board.length - 1][col].data
                                        ?.player != undefined && {
                                        player:
                                            board[board.length - 1][col].data
                                                .player,
                                    }),
                                },
                            };
                    }
                }
            }

            annotate_points();

            let bar = this.enumerate_checkers(this.match.player, [
                this.position.player_bar,
                this.position.opponent_bar,
            ]);

            let off = this.enumerate_checkers(this.match.player, [
                this.position.player_off,
                this.position.opponent_off,
            ]);

            function annotate_bar_off(checkers, property) {
                for (let row = 0; row < checkers.length; row++) {
                    if (row < checkers.length / 2)
                        checkers[row] = {
                            value: checkers[row],
                            data: { type: [property], [property]: 0 },
                            part: 'board-td-' + property,
                            className: property,
                        };
                    else
                        checkers[row] = {
                            value: checkers[row],
                            data: { type: [property], [property]: 1 },
                            part: 'board-td-' + property,
                            className: property,
                        };
                }
            }

            annotate_bar_off(bar, 'bar');
            annotate_bar_off(off, 'off');

            function insert_bar_off(checkers, index) {
                checkers.unshift({ part: 'board-td-num', className: 'num' });
                checkers.push({ part: 'board-td-num', className: 'num' });

                for (let row = 0; row < checkers.length; row++) {
                    board[row].splice(index, 0, checkers[row]);
                }
            }

            insert_bar_off(bar, board[0].length / 2);
            insert_bar_off(off, board[0].length);

            let dice = Array.from({ length: board[0].length });
            dice[this.match.player == 0 ? 2 : 9] = {
                value: DICE[this.match.dice[0] - 1],
                data: { type: 'die', die: this.match.dice[0] },
                part: 'board-td-die',
                className: 'die',
            };
            dice[this.match.player == 0 ? 3 : 10] = {
                value: DICE[this.match.dice[1] - 1],
                data: { type: 'die', die: this.match.dice[1] },
                part: 'board-td-die',
                className: 'die',
            };
            dice[6] = { part: 'board-td-bar', className: 'bar' };
            board.splice(board.length / 2, 0, dice);

            let cube = Array.from({ length: board.length });
            let cube_pos = Math.floor(board.length / 2);
            if (this.match.cube_holder == 0) cube_pos = 1;
            else if (this.match.cube_holder == 1) cube_pos = board.length - 1;
            const cube_val =
                this.match.cube_holder == 3
                    ? 64
                    : Math.pow(2, this.match.cube_value);
            cube[cube_pos] = {
                value: cube_val,
                data: { type: 'cube', cube: this.match.cube_holder },
                part: 'board-td-cube',
                className: 'cube',
            };
            cube[0] = cube[cube.length - 1] = {
                part: 'board-td-num',
                className: 'num',
            };
            for (let row = 0; row < cube.length; row++) {
                board[row].unshift(cube[row]);
            }

            const table = document.createElement('table');
            table.part = 'board-table';
            for (let row = 0; row < board.length; row++) {
                let tr = table.insertRow();
                for (let col = 0; col < board[row].length; col++) {
                    let td = tr.insertCell();

                    let value = board[row][col]?.value;
                    if (value != undefined)
                        td.appendChild(document.createTextNode(value));

                    let data = board[row][col]?.data;
                    if (data != undefined) Object.assign(td.dataset, data);

                    let part = board[row][col]?.part;
                    if (part != undefined) td.part = part;
                    else td.part = 'board-td';

                    let className = board[row][col]?.className;
                    if (className != undefined) td.className = className;

                    td.addEventListener('click', (event) => {
                        const type = event.srcElement.dataset?.type;
                        switch (type) {
                            case 'point':
                                const point = parseInt(
                                    event.srcElement.dataset.point
                                );
                                this.source == undefined
                                    ? this.select(
                                          'point',
                                          point,
                                          parseInt(
                                              event.srcElement.dataset?.player
                                          )
                                      )
                                    : this.handleMove(point);
                                break;
                            case 'bar':
                                const bar = parseInt(
                                    event.srcElement.dataset.bar
                                );
                                if (
                                    this.match.player == bar &&
                                    this.position.player_bar > 0 &&
                                    this.source == undefined
                                )
                                    this.select('bar', bar, this.match.player);
                                else if (this.source == 0) this.deselect();
                                break;
                            case 'off':
                                const off = parseInt(
                                    event.srcElement.dataset.off
                                );
                                if (this.match.player == off && this.source)
                                    this.handleMove(0);
                                break;
                        }
                    });
                }
            }

            const div = this.shadowRoot.querySelector('.board');
            div.innerHTML = '';
            div.appendChild(table);

            this.updateControls();
        }

        updateControls() {
            const undo = this.shadowRoot.querySelector('#undo');
            const double = this.shadowRoot.querySelector('#double');
            const play = this.shadowRoot.querySelector('#play');
            const roll = this.shadowRoot.querySelector('#roll');
            const resign = this.shadowRoot.querySelector('#resign');

            [undo, double, play, roll, resign].forEach((button) => {
                button.disabled = true;
            });

            if (this?.player == this.match.player) {
                resign.disabled = false;

                if (this.match.dice[0] == 0 && this.match.dice[1] == 0) {
                    double.disabled = false;
                    roll.disabled = false;
                } else play.disabled = false;

                if (this.moves.length > 0) {
                    undo.disabled = false;
                }
            }
        }

        header() {
            return this.match.player == 0
                ? this.points(12, 1, -1)
                : this.points(13, 24, 1);
        }

        footer() {
            return this.match.player == 0
                ? this.points(13, 24, 1)
                : this.points(12, 1, -1);
        }

        points(start, stop, step) {
            let points = Array.from(
                { length: (stop - start) / step + 1 },
                (_, i) => ({
                    value: start + i * step,
                    part: 'board-td-num',
                    className: 'num',
                })
            );

            const player = this.match.player;
            const opponent = Math.abs(player - 1);
            for (let i = 0; i < points.length; i++) {
                let checkers = this.position.board_points[points[i].value - 1];
                if (checkers > 0) points[i].data = { player: player };
                else if (checkers < 0) points[i].data = { player: opponent };
            }

            return points;
        }

        enumerate_checkers(player, [...checkers]) {
            function normalize() {
                if (player == 1)
                    checkers = checkers.reverse().map((n) => (n != 0 ? -n : n));
            }

            normalize();

            function split() {
                return {
                    top: checkers.slice(0, checkers.length / 2).reverse(),
                    bottom: checkers.slice(checkers.length / 2),
                };
            }

            const halves = split();
            const columns = halves['top'].length;

            let enumerated = Array.from({ length: CHECKER_ROWS }, (_, i) =>
                Array.from({ length: columns })
            );

            for (const half in halves) {
                for (let col = 0; col < columns; col++) {
                    let row = half == 'top' ? 0 : enumerated.length - 1;
                    let owner = halves[half][col] > 0 ? 0 : 1;
                    let num_checkers = Math.abs(halves[half][col]);
                    for (let i = 0; i < num_checkers; i++) {
                        if (
                            num_checkers > MAX_CHECKERS &&
                            i == MAX_CHECKERS - 1
                        ) {
                            enumerated[row][col] = num_checkers;
                            break;
                        }
                        enumerated[row][col] =
                            owner == 0 ? CHECKER_0 : CHECKER_1;
                        row += half == 'top' ? 1 : -1;
                    }
                }
            }

            return enumerated;
        }

        select(type, value, player) {
            if (isNaN(player)) return;

            if (player != this.match.player) return;

            if (this?.player != this.match.player) return;

            this.source = type == 'point' ? value : 0;
            this.styleSheet.insertRule(
                `td[data-${type}='${value}'] { text-shadow: 0 0 1rem ${
                    player == 0 ? HIGHLIGHT_0 : HIGHLIGHT_1
                } }`,
                0
            );
        }

        deselect() {
            for (let i = 0; i < this.styleSheet.cssRules.length; i++)
                this.styleSheet.deleteRule(i);
            if (this.source != undefined) delete this.source;
        }

        handleMove(destination) {
            if (destination == this.source) {
                this.deselect();
                return;
            }

            if (this.source > 0 && destination > this.source) return;

            this.moves.push(this.source, destination);
            this.applyMove(this.source, destination);
            this.deselect();
            this.render();
        }

        applyMove(source, destination) {
            if (source == 0) this.position.player_bar--;
            else this.position.board_points[source - 1]--;

            if (destination == 0) this.position.player_off++;
            else {
                let hit = this.position.board_points[destination - 1] == -1;
                if (hit) {
                    this.position.board_points[destination - 1] = 1;
                    this.position.opponent_bar--;
                } else {
                    this.position.board_points[destination - 1]++;
                }
            }
        }

        undo() {
            this.reset();
        }

        play() {
            if (this.moves.length == 0)
                this.websocket.send(JSON.stringify({ opcode: 'skip' }));
            else
                this.websocket.send(
                    JSON.stringify({
                        opcode: 'move',
                        move: this.moves.map((n) => (n > 0 ? n : null)),
                    })
                );
        }

        roll() {
            this.websocket.send(JSON.stringify({ opcode: 'roll' }));
        }

        resign() {
            console.log('resign');
        }
    }
);
