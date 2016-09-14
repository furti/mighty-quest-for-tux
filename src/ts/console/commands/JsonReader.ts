import { Command } from '../Command';
import { CommandExecutionContext } from '../CommandExecutionContext';
import { ReaderBase } from './ReaderBase';

export class JsonReader extends ReaderBase {

    public performRead(): void {
        this.console.printLine(
            `\`\`\`javascript
${this.getContent()}
\`\`\``);

        this.console.scrollTop();
    }
}
