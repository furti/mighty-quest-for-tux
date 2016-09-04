import { Command } from './Command';

export interface Executable extends Command {
    /**
     * The file that should be executed by this command.
     * @type {[type]}
     */
    file: string;

    /**
     * The name of the namespace that contains the run function.
     * @type {[type]}
     */
    runNamespace: string;
}