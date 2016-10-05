import { Console } from './Console';

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
    arguments: any[];

    /**
     * The implementation can add additional data to pass to each command
     */
    [name: string]: any;
}