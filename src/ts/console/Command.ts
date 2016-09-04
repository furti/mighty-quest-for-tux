import { CommandArgument } from './CommandArgument';

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
