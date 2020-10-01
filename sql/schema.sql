
-- Copyright 2020 Softwerks LLC

-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at

--     http://www.apache.org/licenses/LICENSE-2.0

-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id INTEGER REFERENCES users,
    created TIMESTAMP WITH TIME ZONE NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    last_seen TIMESTAMP WITH TIME ZONE NOT NULL,
    address INET NOT NULL,
    user_agent TEXT NOT NULL,
    time_zone TEXT NOT NULL
);
