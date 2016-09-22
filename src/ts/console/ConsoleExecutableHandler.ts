import { Executable } from './Executable';
import { Console } from './Console';
import { CommandExecutionContext } from './CommandExecutionContext';
import { CodeEngine } from './CodeEngine';
import { Base64 } from './Base64';

export class ConsoleExecutableHandler {
    private console: Console;
    private executable: Executable;

    constructor(console: Console, executable: Executable) {
        this.console = console;
        this.executable = executable;
    }
    public executeCommand(context: CommandExecutionContext): void {
        var file = this.console.getFile(this.executable.file);

        if (!file) {
            this.console.printLine(`Script **${this.executable.file}** not found.`);
            return;
        }

        var scriptContent = file.content;

        CodeEngine.run({
            scripts: [scriptContent],
            runNamespace: this.executable.runNamespace,
            console: this.console,
            context: context
        });
    }
}
