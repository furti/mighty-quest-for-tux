import { Command } from '../Command';
import { CommandExecutionContext } from '../CommandExecutionContext';
import { ConsoleContext } from '../ConsoleContext';
import { Console } from '../Console';
import { ConsoleFile } from '../ConsoleFile';

/**
 * Command to list all available files.
 */
export class Vi {
    public static command: Command = {
        command: 'vi',
        helpText: 'Open a file for editing.',
        arguments: [{
            name: 'file',
            required: true,
            helpText: 'The name of the file to edit.'
        }]
    };

    private console: Console;
    private fileChanged: boolean;

    constructor(console: Console) {
        this.console = console;
    }

    public executeCommand(context: CommandExecutionContext): void {
        let fileName = context.arguments ? context.arguments[0] as string : null;

        if (!fileName) {
            this.console.printLine("Specify the file to open as an argument.");
            return;
        }

        let file = this.console.getFile(fileName);

        if (!file) {
            this.console.printLine(`File ${fileName} not found`);
            return;
        }

        if (!file.readable && !file.writeable) {
            this.console.printLine(`No permission to edit file ${fileName}`);
            return;
        }

        let consoleContext = this.console.startContext({
            showInput: true,
            editable: true,
            editorMode: this.modeFromFile(file),
            initialContent: this.console.getFileContent(fileName),
            onFileChange: () => this.fileChanged = true
        });

        this.fileChanged = false;

        this.registerCommands(consoleContext);
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

    private modeFromFile(file: ConsoleFile): any {
        if (file.ext === '.js') {
            return 'javascript';
        }

        if (file.ext === '.json') {
            return 'application/json';
        }

        if (file.ext === '.ts') {
            return 'application/typescript';
        }
    }

    private quit(commandExecutionContext: CommandExecutionContext): void {
        let consoleContext = this.console.getCurrentContext();
        let force = commandExecutionContext.arguments && commandExecutionContext.arguments[0] === '!';

        if (!this.fileChanged || force) {
            this.console.closeCurrentContext();
        }
        else {
            this.console.printLine('There are unsaved changes. Save the changes or type **q !** to discard them.');
        }
    }

    private registerCommands(consoleContext: ConsoleContext): void {
        consoleContext.registerCommand({
            command: 'q',
            helpText: 'Close the current file.'
        }, (context) => this.quit(context));
    }

}

