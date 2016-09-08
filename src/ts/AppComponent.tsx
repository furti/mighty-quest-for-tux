import * as React from 'react';

import { Component } from 'react';
import { Console } from './console/Console';

let console = new Console('dist/content');

console.on('server.connect', (serverName: string) => {
    alert(serverName);
});

console.start('intro');

export class AppComponent extends React.Component<{}, {}> {
    render(): JSX.Element {
        return <div className="layout-row layout-grow">
            <h1 className="title">The mighty quest for Tux</h1>
            <div id="console-container">
                {
                    console.render()
                }
            </div>
        </div>;
    }
}