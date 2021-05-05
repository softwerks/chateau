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

const POINT_CX = [140, 210, 280, 350, 420, 490, 650, 720, 790, 860, 930, 1000];
const BOARD = {
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
    acceptFill: 'green',
    rejectFill: 'red',
    stroke: 'black',
    strokeWidth: 8,
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

let template = document.createElement('template');
// prettier-ignore
template.innerHTML = `
    <style>
        :host {
            align-items: center;
            display: flex;
            flex-direction: column;
        }

        svg {
            max-height: 100vh;
            max-width: 100vw;
        }

        text {
            font-weight: bold;
            pointer-events: none;
            user-select: none;
        }
    </style>
    <svg id="backgammon" viewBox="0 0 1280 720">
        <rect width="1280" height="720" fill="black" />
        <rect x="20" y="${BOARD.top}" width="80" height="${BOARD.bottom - BOARD.top}" fill="tan" />
        <rect class="field" x="104" y="${BOARD.top}" width="426" height="${BOARD.bottom - BOARD.top}" fill="tan" />
        <rect class="field" x="610" y="${BOARD.top}" width="426" height="${BOARD.bottom - BOARD.top}" fill="tan" />
        <rect x="1040" y="${BOARD.top}" width="80" height="${BOARD.bottom - BOARD.top}" fill="tan" />
        <rect class="score0" x="1144" y="${BOARD.top + 4}" width="112" height="112" rx="8" ry="8" fill="${SCORE.fill[0]}" stroke="${SCORE.stroke[0]}" stroke-width="8" />
        <rect class="score1" x="1144" y="${BOARD.bottom - 112 - 4}" width="112" height="112" rx="8" ry="8" fill="${SCORE.fill[1]}" stroke="${SCORE.stroke[1]}" stroke-width="8" />

        <polygon points="110,${BOARD.top} 170,${BOARD.top} ${POINT_CX[0]},320" fill="green" />
        <polygon points="180,${BOARD.top} 240,${BOARD.top} ${POINT_CX[1]},320" fill="black" />
        <polygon points="250,${BOARD.top} 310,${BOARD.top} ${POINT_CX[2]},320" fill="green" />
        <polygon points="320,${BOARD.top} 380,${BOARD.top} ${POINT_CX[3]},320" fill="black" />
        <polygon points="390,${BOARD.top} 450,${BOARD.top} ${POINT_CX[4]},320" fill="green" />
        <polygon points="460,${BOARD.top} 520,${BOARD.top} ${POINT_CX[5]},320" fill="black" />

        <polygon points="620,${BOARD.top} 680,${BOARD.top} ${POINT_CX[6]},320" fill="green" />
        <polygon points="690,${BOARD.top} 750,${BOARD.top} ${POINT_CX[7]},320" fill="black" />
        <polygon points="760,${BOARD.top} 820,${BOARD.top} ${POINT_CX[8]},320" fill="green" />
        <polygon points="830,${BOARD.top} 890,${BOARD.top}  ${POINT_CX[9]},320" fill="black" />
        <polygon points="900,${BOARD.top} 960,${BOARD.top} ${POINT_CX[10]},320" fill="green" />
        <polygon points="970,${BOARD.top} 1030,20 ${POINT_CX[11]},320" fill="black" />

        <polygon points="110,${BOARD.bottom} 170,${BOARD.bottom} ${POINT_CX[0]},400" fill="black" />
        <polygon points="180,${BOARD.bottom} 240,${BOARD.bottom} ${POINT_CX[1]},400" fill="green" />
        <polygon points="250,${BOARD.bottom} 310,${BOARD.bottom} ${POINT_CX[2]},400" fill="black" />
        <polygon points="320,${BOARD.bottom} 380,${BOARD.bottom} ${POINT_CX[3]},400" fill="green" />
        <polygon points="390,${BOARD.bottom} 450,${BOARD.bottom} ${POINT_CX[4]},400" fill="black" />
        <polygon points="460,${BOARD.bottom} 520,${BOARD.bottom} ${POINT_CX[5]},400" fill="green" />

        <polygon points="620,${BOARD.bottom} 680,${BOARD.bottom} ${POINT_CX[6]},400" fill="black" />
        <polygon points="690,${BOARD.bottom} 750,${BOARD.bottom} ${POINT_CX[7]},400" fill="green" />
        <polygon points="760,${BOARD.bottom} 820,${BOARD.bottom} ${POINT_CX[8]},400" fill="black" />
        <polygon points="830,${BOARD.bottom} 890,${BOARD.bottom} ${POINT_CX[9]},400" fill="green" />
        <polygon points="900,${BOARD.bottom} 960,${BOARD.bottom} ${POINT_CX[10]},400" fill="black" />
        <polygon points="970,${BOARD.bottom} 1030,${BOARD.bottom} ${POINT_CX[11]},400" fill="green" />
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

let reject = document.createElement('template');
// prettier-ignore
reject.innerHTML = `
    <svg width="${BUTTON.width}" height="${BUTTON.height}" viewBox ="0 0 ${BUTTON.width} ${BUTTON.height}">
        <rect width="${BUTTON.width}" height="${BUTTON.height}" rx="${BUTTON.radius}" ry="${BUTTON.radius}" fill="${BUTTON.rejectFill}" />
        <circle cx="${BUTTON.width / 2}" cy="${BUTTON.height / 2}" r="22" fill="none" stroke="${BUTTON.stroke}" stroke-width="${BUTTON.strokeWidth}" />
        <path d="M16 16 L44 44" stroke="${BUTTON.stroke}" stroke-width="${BUTTON.strokeWidth}" />
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
                console.log(msg);
                switch (msg.code) {
                    case 'player':
                        this.player = msg.player;
                        break;
                    case 'update':
                        console.log(msg.id);
                        let game = this.decode(msg.id);
                        this.match = game.match;
                        this.position = game.position;
                        console.log(this.match, this.position);
                        [this.plays, this.reversedPlays] = this.generatePlays();
                        console.log(this.plays);
                        this.moveList = [];
                        this.clear();
                        this.draw();
                        break;
                }
            });

            this.shadowRoot
                .querySelector('svg')
                .querySelectorAll('.field')
                .forEach((field) => {
                    field.addEventListener('click', (event) => {
                        this.roll(event);
                    });
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
                            playerHome(boardPoints).slice(point + 1, pips)
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
                if (higherPlays.length) plays = higerPlays;

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

            console.log(plays);
            console.log(tree(plays));

            return [tree(plays), tree(reversedPlays)];
        }

        draw() {
            this.drawPoints();
            this.drawBar();
            this.drawOff();
            this.drawCube();
            this.drawScore();
            this.drawPipCount();
            if (this.match.dice[0] != 0) this.drawDice();
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

            let normalizedPoints =
                this.match.player == 0
                    ? annotatedPoints
                    : annotatedPoints.reverse();

            const halves = {
                top: normalizedPoints
                    .slice(0, normalizedPoints.length / 2)
                    .reverse(),
                bottom: normalizedPoints.slice(normalizedPoints.length / 2),
            };

            for (const half in halves) {
                let direction = half == 'top' ? DIRECTION.down : DIRECTION.up;
                let cy = BOARD[half] + CHECKER_COMBINED_RADIUS * direction;

                halves[half].forEach((point, index) => {
                    if (point.numCheckers != 0) {
                        let cx = POINT_CX[index];
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
                    BOARD.top + CHECKER_COMBINED_RADIUS,
                    DIRECTION.down
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
                    BOARD.bottom - CHECKER_COMBINED_RADIUS,
                    DIRECTION.up
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
                checker.setAttribute('stroke', stroke);
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
            if (numOffPlayer0 > 0) this.drawTray(0, numOffPlayer0);

            const numOffPlayer1 =
                this.match.player == 1
                    ? this.position.playerOff
                    : this.position.opponentOff;
            if (numOffPlayer1 > 0) this.drawTray(1, numOffPlayer1);
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
                off.className.baseVal = 'foreground';
                svg.appendChild(off);

                num--;
                y += (OFF.height + OFF.padding) * direction;
            } while (num > 0);
        }

        drawCube() {
            const svg = this.shadowRoot.querySelector('svg');

            let cube = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'rect'
            );
            let x;
            if (!this.match.double) {
                x = BOARD.trayLeft;
            } else {
                if (this.match.player == 0)
                    x = BOARD.rightX + CUBE.width / 2 + BUTTON.padding;
                else x = BOARD.leftX + CUBE.width / 2 + BUTTON.padding;
            }
            cube.setAttribute('x', x - CUBE.width / 2);

            let y;
            if (this.match.cubeHolder == 3 || this.match.double)
                y = BOARD.middleY - CUBE.height / 2;
            else if (this.match.cubeHolder == 0) y = BOARD.top + CUBE.padding;
            else y = BOARD.bottom - (CUBE.height + CUBE.padding);
            cube.setAttribute('y', y);

            cube.setAttribute('rx', CUBE.radius);
            cube.setAttribute('ry', CUBE.radius);
            cube.setAttribute('width', CUBE.width);
            cube.setAttribute('height', CUBE.height);
            cube.setAttribute('fill', CUBE.fill);
            cube.addEventListener('click', (event) => {
                this.double(event);
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
                rejectButton.firstElementChild.className.baseVal = 'foreground';
                rejectButton.firstElementChild.addEventListener(
                    'click',
                    (event) => {
                        this.rejectDouble(event);
                    }
                );
                svg.appendChild(rejectButton);
            }
        }

        drawScore() {
            const svg = this.shadowRoot.querySelector('svg');

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
                            ? BOARD.top + SCORE.height / 2
                            : BOARD.bottom - SCORE.height / 2
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

            if (this.match.gameState > 0) {
                if (this.match.turn == 0) {
                    svg.querySelector('.score0').setAttribute(
                        'stroke',
                        SCORE.highlight
                    );
                    svg.querySelector('.score1').setAttribute(
                        'stroke',
                        SCORE.stroke[1]
                    );
                } else if (this.match.turn == 1) {
                    svg.querySelector('.score1').setAttribute(
                        'stroke',
                        SCORE.highlight
                    );
                    svg.querySelector('.score0').setAttribute(
                        'stroke',
                        SCORE.stroke[0]
                    );
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
                label.setAttribute(
                    'y',
                    player == 0
                        ? BOARD.middleY - PIP_COUNT.offsetY
                        : BOARD.middleY + PIP_COUNT.offsetY
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
                die.firstElementChild.className.baseVal = 'foreground';
                die.firstElementChild.addEventListener('click', (event) => {
                    this.reverseDice(event);
                });
                svg.appendChild(die);
            });
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

        double(event) {
            if (this.match.double) return this.acceptDouble(event);

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
    }
);
