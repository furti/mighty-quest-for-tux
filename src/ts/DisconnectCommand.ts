import { Console } from './console/Console';
import { Command } from './console/Command';
import { CommandExecutionContext } from './console/CommandExecutionContext';

export class Disconnect {

    public static command: Command = {
        command: 'disconnect',
        helpText: 'Close the connection to the current server'
    }

    constructor(private console: Console) {

    }

    public executeCommand(context: CommandExecutionContext): void {
        this.console.fire('server.disconnected');
    }
}