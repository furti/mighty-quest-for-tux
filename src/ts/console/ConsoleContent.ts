import { ConsoleFile } from './ConsoleFile';
import { Executable } from './Executable';
/**
 * Contains all the files and folders for a console instance.
 */
export interface ConsoleContent {
    /**
     * Markdown String that should be shown on startup.
     */
    welcome?: string;

    /**
     * List of Executable scripts for the console.
     *
     * @type {Executable}
     */
    executables: Executable[];

    /**
     * All files contained in the console;
     * @type {ConsoleFile}
     */
    files: { [fileName: string]: ConsoleFile };
}
