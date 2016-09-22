import { ConsoleFile } from './ConsoleFile';
import { ConsoleContent } from './ConsoleContent';

export interface FileSystem {
    init(files: { [fileName: string]: ConsoleFile }): void;
    getFile(fileName: string): ConsoleFile;
    listFiles(): ConsoleFile[];
    saveFile(fileName: string, content: any): void;
}