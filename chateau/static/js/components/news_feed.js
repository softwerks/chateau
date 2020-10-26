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

class Feed extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        const t = (entry, tagname) => entry.getElementsByTagName(tagname)[0];

        fetch(this.getAttribute('url'))
            .then((response) => response.text())
            .then((xml) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xml, 'text/xml');
                const list = document.createElement('ul');
                list.part = 'entries';
                for (const entry of xmlDoc.getElementsByTagName('entry')) {
                    const listItem = document.createElement('li');
                    listItem.part = 'entry';

                    const link = document.createElement('a');
                    link.part = 'title';
                    link.setAttribute(
                        'href',
                        t(entry, 'link').getAttribute('href')
                    );
                    const title = document.createTextNode(
                        t(entry, 'title').innerHTML
                    );
                    link.appendChild(title);
                    listItem.appendChild(link);

                    const date = document.createElement('div');
                    date.part = 'date';
                    const dateText = document.createTextNode(
                        new Date(
                            t(entry, 'published').textContent
                        ).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })
                    );
                    date.appendChild(dateText);
                    listItem.appendChild(date);

                    list.appendChild(listItem);
                }

                shadowRoot.append(list);
            });
    }
}

customElements.define('news-feed', Feed);
