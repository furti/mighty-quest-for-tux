import { Command } from '../Command';
import { CommandExecutionContext } from '../CommandExecutionContext';
import { ReaderBase } from './ReaderBase';

export class MarkdownReader extends ReaderBase {

    public performRead(): void {
        this.console.printLine(this.getContent());
        this.console.scrollTop();
    }
}
