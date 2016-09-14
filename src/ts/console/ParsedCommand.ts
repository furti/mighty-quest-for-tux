export interface ParsedCommand {
    command: string;
    arguments?: any[];

    /**
     * The value of the last argument entered by the user.
     * @type {string}
     */
    lastArgument?: any;
}
