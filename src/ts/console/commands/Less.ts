import { Command } from '../Command';
import { CommandExecutionContext } from '../CommandExecutionContext';
import { Console } from '../Console';
import { ConsoleContext } from '../ConsoleContext';
import { ConsoleFile } from '../ConsoleFile';
import { Base64 } from '../Base64';
import { Reader } from './Reader';
import { MarkdownReader } from './MarkdownReader';
import { JsonReader } from './JsonReader';

/**
 * Command to read a file.
 */
export class Less {
    private reader: Reader;

    public static command: Command = {
        command: 'less',
        helpText: 'Shows the content of a file.',
        arguments: [{
            name: 'file',
            required: true,
            helpText: 'The name of the file to show.'
        }]
    };

    private console: Console;

    constructor(console: Console) {
        this.console = console;
    }

    public quit(): void {
        this.console.closeCurrentContext();
    }

    public executeCommand(context: CommandExecutionContext): void {
        if (!context.arguments) {
            this.console.printLine('a filename argument is required. use **read filename** to read a file.');
            return;
        }

        var fileName = context.arguments[0] as string;

        var file = this.console.getFile(fileName);

        if (!file) {
            this.console.printLine(`File **${fileName}** not found.`);
            return;
        }

        if (file.ext === '.md') {
            this.reader = new MarkdownReader(file, this.console);
        }
        else if (file.ext === '.json') {
            this.reader = new JsonReader(file, this.console);
        }
        else {
            throw `File ending ${file.ext} not supported yet`;
        }

        var consoleContext = this.console.startContext({
            showInput: true,
            editable: false
        });

        this.registerCommands(consoleContext);
        this.reader.performRead();
    }

    public autocomplete(args: string[]): string[] {
        if (args.length <= 1) {
            var files = this.console.getFiles();

            if (!files) {
                return [];
            }

            return files.map((file) => {
                return file.base;
            });
        }

        return [];
    }

    private registerCommands(consoleContext: ConsoleContext): void {
        consoleContext.registerCommand({
            command: 'q',
            helpText: 'Close the current file.'
        }, (context) => this.quit());
    }
}
