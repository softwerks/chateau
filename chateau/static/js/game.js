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

const url = 'ws://' + location.hostname + ':8000/socket' + location.pathname;
const socket = new WebSocket(url);

socket.onopen = function (event) {
    socket.send('ping');
};

socket.onmessage = function (event) {
    console.log(event.data);
    socket.close(1000);
};