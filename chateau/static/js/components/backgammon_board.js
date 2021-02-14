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

class BackgammonBoard extends HTMLElement {
    static checker_0 = '⚪';
    static checker_1 = '⚫';
    static checker_rows = 10;
    static max_checkers = 5;
    static dice = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        div.part = 'board-div';
        shadowRoot.append(div);

        let table = document.createElement('table');
        div.appendChild(table);

        const websocketURL = this.getAttribute('websocketURL');
        const websocket = new WebSocket(websocketURL);

        websocket.onmessage = (event) => {
            const game = JSON.parse(event.data);
            this.match = game.match;
            this.position = game.position;
            table.replaceWith(this.render());
        };

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Escape':
                    delete this.source;
                    break;
            }
        });

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

    render() {
        let board = [];

        board.push(this.header());
        board.push(
            ...BackgammonBoard.enumerate_checkers(
                this.match.player,
                this.position.board_points
            )
        );
        board.push(this.footer());

        function annotate_points() {
            for (let row = 1; row <= BackgammonBoard.checker_rows; row++) {
                for (let col = 0; col < board[row].length; col++) {
                    if (row <= BackgammonBoard.checker_rows / 2)
                        board[row][col] = {
                            value: board[row][col],
                            data: { type: 'point', point: board[0][col].value },
                        };
                    else
                        board[row][col] = {
                            value: board[row][col],
                            data: {
                                type: 'point',
                                point: board[board.length - 1][col].value,
                            },
                        };
                }
            }
        }

        annotate_points();

        let bar = BackgammonBoard.enumerate_checkers(this.match.player, [
            this.position.player_bar,
            this.position.opponent_bar,
        ]);

        let off = BackgammonBoard.enumerate_checkers(this.match.player, [
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
                    };
                else
                    checkers[row] = {
                        value: checkers[row],
                        data: { type: [property], [property]: 1 },
                        part: 'board-td-' + property,
                    };
            }
        }

        annotate_bar_off(bar, 'bar');
        annotate_bar_off(off, 'off');

        function insert_bar_off(checkers, index) {
            checkers.unshift({ part: 'board-td-num' });
            checkers.push({ part: 'board-td-num' });

            for (let row = 0; row < checkers.length; row++) {
                board[row].splice(index, 0, checkers[row]);
            }
        }

        insert_bar_off(bar, board[0].length / 2);
        insert_bar_off(off, board[0].length);

        let dice = Array.from({ length: board[0].length });
        dice[this.match.player == 0 ? 2 : 9] = {
            value: BackgammonBoard.dice[this.match.dice[0] - 1],
            data: { type: 'die', die: this.match.dice[0] },
            part: 'board-td-die',
        };
        dice[this.match.player == 0 ? 3 : 10] = {
            value: BackgammonBoard.dice[this.match.dice[1] - 1],
            data: { type: 'die', die: this.match.dice[1] },
            part: 'board-td-die',
        };
        dice[6] = { part: 'board-td-bar' };
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
        };
        cube[0] = cube[cube.length - 1] = { part: 'board-td-num' };
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

                td.addEventListener('click', (event) => {
                    const type = event.srcElement.dataset?.type;
                    switch (type) {
                        case 'point':
                            const point = parseInt(
                                event.srcElement.dataset.point
                            );
                            this.source == undefined
                                ? (this.source = point)
                                : this.handleMove(point);
                            break;
                        case 'bar':
                            const bar = parseInt(event.srcElement.dataset.bar);
                            if (
                                this.match.player == bar &&
                                this.position.player_bar > 0 &&
                                this.source == undefined
                            )
                                this.source = 0;
                            break;
                        case 'off':
                            const off = parseInt(event.srcElement.dataset.off);
                            if (this.match.player == off && this.source)
                                this.handleMove(0);
                            break;
                    }
                });
            }
        }

        return table;
    }

    header() {
        return this.match.player == 0
            ? BackgammonBoard.range(12, 1, -1)
            : BackgammonBoard.range(13, 24, 1);
    }

    footer() {
        return this.match.player == 0
            ? BackgammonBoard.range(13, 24, 1)
            : BackgammonBoard.range(12, 1, -1);
    }

    static range(start, stop, step) {
        return Array.from({ length: (stop - start) / step + 1 }, (_, i) => ({
            value: start + i * step,
            part: 'board-td-num',
        }));
    }

    static enumerate_checkers(player, checkers) {
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

        let enumerated = Array.from(
            { length: BackgammonBoard.checker_rows },
            (_, i) => Array.from({ length: columns })
        );

        for (const half in halves) {
            for (let col = 0; col < columns; col++) {
                let row = half == 'top' ? 0 : enumerated.length - 1;
                let owner = halves[half][col] > 0 ? 0 : 1;
                let num_checkers = Math.abs(halves[half][col]);
                for (let i = 0; i < num_checkers; i++) {
                    if (
                        num_checkers > BackgammonBoard.max_checkers &&
                        i == BackgammonBoard.max_checkers - 1
                    ) {
                        enumerated[row][col] = num_checkers;
                        break;
                    }
                    enumerated[row][col] =
                        owner == 0
                            ? BackgammonBoard.checker_0
                            : BackgammonBoard.checker_1;
                    row += half == 'top' ? 1 : -1;
                }
            }
        }

        return enumerated;
    }

    handleMove(destination) {
        console.log([this.source, destination]);
        delete this.source;
    }
}

customElements.define('backgammon-board', BackgammonBoard);
