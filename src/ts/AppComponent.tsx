import * as React from 'react';

import { Component } from 'react';
import { Console } from './console/Console';
import { Disconnect } from './DisconnectCommand';
import { LevelManager } from './LevelManager';

let console = new Console('dist/content');
let levelManager = new LevelManager();
levelManager.init();

console.registerAdditionalCommandData('levelManager', levelManager);


console.on('server.connect', (folder: string) => {
    console.close();
    console.start(folder).then(() => {
        console.getCurrentContext().registerCommand(Disconnect.command, new Disconnect(console));
    });
});

console.on('server.disconnected', () => {
    console.close();
    console.start('intro');
});

console.on('level.complete', (levelName: string) => {
    levelManager.levelCompleted(levelName);
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