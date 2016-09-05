/// <reference path="./AllowedGlobals.d.ts"/>

declare namespace console {
    export interface CommandParams {
        /**
         * The console that executed the command. Can be used to output text.
         * @type {Console}
         */
        console: Console;

        /**
         * The list of arguments entered for this command
         * @type {string[]}
         */
        arguments: { [name: string]: any };
    }

    export interface Console {

        getFile(fileName: string): ConsoleFile;

        /**
         * Returns a list of all files inside the console.
         * @return {ConsoleFile[]} List of files
         */
        getFiles(): ConsoleFile[];

        /**
         * Prints a line on the console.
         * @param {string} line the text to print to the console
         */
        printLine(line: string): void;

        printFile(fileName: string): void;

        executeCommand(command: string): void

        scrollTop(): void;

        close(): void;

        startContext(config: ConsoleContextConfig): ConsoleContext;

        /**
         * Removes the current context from the stack and renders the previous context.
         * The default context cannot be removed.
         */
        closeCurrentContext(): void;
    }

    export interface ConsoleContextConfig {
        showInput: boolean;
    }

    export interface ConsoleContext {
        registerCommand(command: Command, handler: CommandHandler, autocompleteHandler?: AutocompleteHandler): void;

        executeCommand(commandString: string): void;

        autocomplete(current: string): string[];
    }

    export interface ConsoleFile {
        /**
         * The files content
         */
        content: string;
        /**
         * The files name without extension.
         */
        name: string;
        /**
         * The files extension
         */
        ext: string;
        /**
         * The filename + extension.
         */
        base: string;

        readable: boolean;
        writeable: boolean;
        executable: boolean;
    }

    export interface Command {
        /**
         * The string the user must enter to execute this command.
         * @type {[type]}
         */
        command: string;

        /**
         * The text that is shown when the help command is called without parameters.
         * Should be a one liner that describes the command.
         * @type {string}
         */
        helpText: string;

        arguments?: CommandArgument[]
    }

    export interface CommandArgument {
        name: string;
        required: boolean;
        helpText: string;
    }

    export type CommandHandler = ((context: CommandExecutionContext) => void) | { executeCommand: (context: CommandExecutionContext) => void };

    export type AutocompleteHandler = ((argumentName: string) => string[]) | { autocomplete: (argumentName: string) => string[] };

    export interface CommandExecutionContext {
        arguments?: { [name: string]: any };
    }

}