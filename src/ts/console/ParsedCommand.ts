export interface ParsedCommand {
    command: string;
    arguments?: { [name: string]: any };

    /**
     * The name of the last argument entered by the user.
     * @type {string}
     */
    lastArgumentName?: string;
}
