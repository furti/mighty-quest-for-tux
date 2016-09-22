import { Console } from '../Console';
import { ConsoleFile } from '../ConsoleFile';
import { Reader } from './Reader';

export abstract class ReaderBase implements Reader {
    private file: ConsoleFile;
    protected console: Console;

    constructor(file: ConsoleFile, console: Console) {
        this.file = file;
        this.console = console;
    }

    public getContent(): string {
        return this.file.content;
    }

    public abstract performRead(): void;
}