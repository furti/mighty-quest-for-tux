import { Command } from '../Command';
import { CommandExecutionContext } from '../CommandExecutionContext';
import { Console } from '../Console';

/**
 * Command to read a file.
 */
export class Exit {
    public static command: Command = {
        command: 'exit',
        helpText: 'Close the console'
    };

    private console: Console;

    constructor(console: Console) {
        this.console = console;
    }

    public executeCommand(context: CommandExecutionContext): void {
        this.console.close();
    }
}
