import * as React from 'react';

import { Component } from 'react';
import { Console } from './console/Console';

let console = new Console('intro');
console.start();

export class AppComponent extends React.Component<{}, {}> {
    render(): JSX.Element {
        return <div className="layout-row layout-grow">
            <h1>The mighty quest for Tux</h1>
            <div id="console-container">
                {
                    console.render()
                }
            </div>
        </div>;
    }
}