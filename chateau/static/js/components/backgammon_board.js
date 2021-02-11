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

const range = (start, stop, step) =>
    Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
    );

function checkers(match, position) {
    if (match.player == 1)
        position = position.reverse().map((n) => (n != 0 ? -n : n));

    const split = {
        top: position.slice(0, position.length / 2).reverse(),
        bottom: position.slice(position.length / 2),
    };

    let checkers = Array.from({ length: 10 }, (_, i) =>
        Array.from({ length: split['top'].length })
    );

    for (const half in split) {
        for (let col = 0; col < split[half].length; col++) {
            let row = half == 'top' ? 0 : checkers.length - 1;
            for (let i = 0; i < Math.abs(split[half][col]); i++) {
                if (Math.abs(split[half][col]) > 5 && i == 4) {
                    checkers[row][col] = Math.abs(split[half][col]);
                    break;
                }
                checkers[row][col] = split[half][col] > 0 ? '⚪' : '⚫';
                row += half == 'top' ? 1 : -1;
            }
        }
    }

    return checkers;
}

class BackgammonBoard extends HTMLElement {
    static dice = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    static render(match, position) {
        const points = checkers(match, position.board_points);
        const bar = checkers(match, [
            position.player_bar,
            position.opponent_bar,
        ]);
        const off = checkers(match, [
            position.player_off,
            position.opponent_off,
        ]);

        let board = [];
        board.push(match.player == 0 ? range(12, 1, -1) : range(13, 24, 1));
        board.push(...points);
        board.push(match.player == 0 ? range(13, 24, 1) : range(12, 1, -1));
        bar.unshift(undefined);
        bar.push(undefined);
        for (let row = 0; row < bar.length; row++) {
            board[row].splice(6, 0, bar[row]);
        }
        off.unshift(undefined);
        off.push(undefined);
        for (let row = 0; row < off.length; row++) {
            board[row].push(off[row]);
        }
        let dice = Array.from({ length: 15 });
        dice[match.player == 0 ? 2 : 9] =
            BackgammonBoard.dice[match.dice[0] - 1];
        dice[match.player == 0 ? 3 : 10] =
            BackgammonBoard.dice[match.dice[1] - 1];
        board.splice(6, 0, dice);
        let double = Array.from({ length: 13 });
        let double_pos = 6;
        if (match.cube_holder == 0) double_pos = 1;
        else if (match.cube_holder == 1) double_pos = 11;
        const double_val =
            match.cube_holder == 3 ? 64 : Math.pow(2, match.cube_value);
        double[double_pos] = double_val;
        for (let row = 0; row < double.length; row++) {
            board[row].unshift(double[row]);
        }

        const table = document.createElement('table');
        table.part = 'board-table';
        for (let row = 0; row < board.length; row++) {
            let tr = table.insertRow();
            for (let col = 0; col < board[row].length; col++) {
                let td = tr.insertCell();
                if (row == 0 || row == board.length - 1)
                    td.part = 'board-td-num';
                else if (col == 6) td.part = 'board-td-bar';
                else td.part = 'board-td';
                if (board[row][col] != undefined) {
                    if (row == 6) td.part = 'board-td-die';
                    let tdText = document.createTextNode(board[row][col]);
                    td.appendChild(tdText);
                }
            }
        }

        return table;
    }

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        div.part = 'board-div';
        shadowRoot.append(div);

        const websocketURL = this.getAttribute('websocketURL');
        const websocket = new WebSocket(websocketURL);

        websocket.onmessage = function (event) {
            const game = JSON.parse(event.data);
            console.log(game);
            div.innerHTML = '';
            div.appendChild(BackgammonBoard.render(game.match, game.position));
        };

        const form = document.createElement('form');
        form.autocomplete = 'off';
        const move = document.createElement('input');
        move.type = 'text';
        move.id = 'move';
        form.appendChild(move);
        const submit = document.createElement('input');
        submit.type = 'submit';
        form.appendChild(submit);
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            websocket.send(
                JSON.stringify({
                    opcode: 'move',
                    move: move.value
                        .split(' ')
                        .map(Number)
                        .map((n) => (n > 0 ? n : null)),
                })
            );
            form.reset();
        });
        shadowRoot.append(form);
    }
}

customElements.define('backgammon-board', BackgammonBoard);
