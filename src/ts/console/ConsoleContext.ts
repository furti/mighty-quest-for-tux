import { ConsoleContextConfig } from './ConsoleContextConfig';
import { ConsoleEngine } from './ConsoleEngine';
import { Command } from './Command';
import { CommandHandler } from './CommandHandler';
import { AutocompleteHandler } from './AutocompleteHandler';
import { CommandExecutionState } from './CommandExecutionState';
import { Console } from './Console';
import { ConsoleEvent } from './ConsoleEvent';
import * as CodeMirror from 'codemirror';

import { Logger } from './Logger';

export class ConsoleContext {
    public lines: string[];
    public id: number;
    public config: ConsoleContextConfig;
    private consoleEngine: ConsoleEngine;
    private console: Console;
    private codeMirror: CodeMirror.EditorFromTextArea;

    constructor(id: number, connectedConsole: Console, config: ConsoleContextConfig) {
        this.lines = [];
        this.id = id;
        this.config = config;
        this.consoleEngine = new ConsoleEngine(connectedConsole);
        this.console = connectedConsole;
    }

    public registerCommand(command: Command, handler: CommandHandler, autocompleteHandler?: AutocompleteHandler): void {
        this.consoleEngine.registerCommand(command, handler, autocompleteHandler);
    }

    public executeCommand(commandString: string): void {
        var result = this.consoleEngine.execute(commandString)

        if (result.state === CommandExecutionState.Error) {
            this.console.printLine(result.message);
        }
        else {
            Logger.debug('ConsoleContext', `Fire COMMAND_EXECUTED for result %o`, result);
            this.console.fire(ConsoleEvent.COMMAND_EXECUTED, result.command);
        }
    }

    public autocomplete(current: string): string[] {
        return this.consoleEngine.autocomplete(current);
    }

    public destroy(): void {
        if (this.codeMirror) {
            this.codeMirror.toTextArea();
        }
    }

    public registerCodeMirror(codeMirror: CodeMirror.EditorFromTextArea): void {
        this.codeMirror = codeMirror;

        if (this.config.initialContent) {
            this.codeMirror.setValue(this.config.initialContent);
        }
    }
}
