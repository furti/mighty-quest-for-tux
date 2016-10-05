import { Console } from './Console';
import { Command } from './Command';
import { CommandHandler } from './CommandHandler';
import { AutocompleteHandler } from './AutocompleteHandler';
import { CommandExecutionResult } from './CommandExecutionResult';
import { CommandExecutionState } from './CommandExecutionState';
import { QueryingEntry } from './QueryingEntry';
import { ParsedCommand } from './ParsedCommand';

/**
 * The core of the console that supports command execution and autocomplete.
 */
export class ConsoleEngine {
    private commands: { [command: string]: CommandExecutor };
    private additionalData: { [name: string]: any };

    constructor(private console: Console) {
        this.commands = {};
    }

    /**
     * Add a command to the engine. The handler will be called with the specified parameters and options when the command is executed.
     * @param  {Command}                 command the command
     * @param  {CommandExecutionContext} handler the handler to execute
     */
    public registerCommand(command: Command, handler: CommandHandler, autocompleteHandler?: AutocompleteHandler): void {
        this.commands[command.command] = new CommandExecutor(command, handler, autocompleteHandler);
    }

    /**
     * Add data to pass to each executed command.
     * 
     * @param {string} name the name of the data object to add
     * @param {*} data the actual data
     * 
     * @memberOf ConsoleEngine
     */
    public registerAdditionalData(name: string, data: any): void {
        if (!this.additionalData) {
            this.additionalData = {};
        }

        this.additionalData[name] = data;
    }

    /**
     * Parses the given commandString and executes the associated command
     * @param {string} commandString the command to parse
     */
    public execute(commandString: string): CommandExecutionResult {
        if (!commandString) {
            return;
        }

        var parsedCommand = this.parseCommand(commandString);

        if (!parsedCommand) {
            return {
                state: CommandExecutionState.Error,
                message: `Command **${commandString}** could not be parsed`
            };
        }

        if (parsedCommand.command === 'help') {
            this.showHelp(parsedCommand);

            return {
                state: CommandExecutionState.Success,
                command: parsedCommand
            };
        }

        if (!this.commands[parsedCommand.command]) {
            return {
                state: CommandExecutionState.Error,
                message: `**${commandString}:** command not found`
            };
        }

        try {
            this.commands[parsedCommand.command].execute(parsedCommand, this.additionalData);

            return {
                state: CommandExecutionState.Success,
                command: parsedCommand
            };
        }
        catch (e) {
            return {
                state: CommandExecutionState.Error,
                message: e.toString()
            };
        }
    }

    public autocomplete(current: string): string[] {
        if (!current) {
            return [];
        }

        var parsedCommand = this.parseCommand(current);

        if (!parsedCommand.arguments) {
            return this.query(parsedCommand.command, Object.keys(this.commands));
        }
        else {
            var currentCommand = this.commands[parsedCommand.command];
            var possibleValues = currentCommand.autocomplete(parsedCommand.arguments);

            return this.query(parsedCommand.lastArgument, possibleValues)
                .map((value) => {
                    return parsedCommand.command + ' ' + value;
                });
        }
    }

    private query(query: string, possibleValues: string[]): string[] {
        if (!this.commands) {
            return [];
        }

        var result: QueryingEntry[] = [];

        for (let commandString of possibleValues) {
            var distance = Levenshtein.get(query, commandString);

            if (distance < commandString.length / 2 || commandString.indexOf(query) === 0) {
                result.push({
                    value: commandString,
                    distance: distance
                });
            }
        }

        return this.processQueryResult(result);
    }

    private processQueryResult(result: QueryingEntry[]): string[] {
        if (!result) {
            return [];
        }

        return result.sort((entry1, entry2) => {
            return entry1.distance - entry2.distance;
        }).map((entry) => {
            return entry.value;
        });
    }

    private parseCommand(commandString: string): ParsedCommand {
        var parts = commandString.trim().split(/\s+/);

        if (parts.length === 0) {
            return;
        }

        let args = parts.splice(1);

        return {
            command: parts[0],
            arguments: args.length === 0 ? null : args,
            lastArgument: args.length > 0 ? args[args.length - 1] : null
        }
    }

    private getLastArgumentName(commandParts: string[]): string {
        if (commandParts.length <= 1) {
            return;
        }

        var args = commandParts.slice(1),
            command = this.commands[commandParts[0]];

        if (!command) {
            return;
        }

        return command.getArgumentName(args.length - 1);
    }

    private showHelp(parsedCommand: ParsedCommand): void {
        if (!parsedCommand.arguments) {

            this.console.printLine('Parameters are shown with _emphasis_. Optional parameters in [_square brackets_]')

            for (let commandName of this.getCommandNamesOrdered()) {
                let commandExecutor = this.commands[commandName];

                this.console.printLine(commandExecutor.help(false));
            }
        }
        else {
            var commandName = parsedCommand.arguments[0];
            var command = this.commands[commandName];

            if (!command) {
                this.console.printLine(`Command **${commandName}** not found!`);
            }
            else {
                this.console.printLine(command.help(true));
            }
        }
    }

    private getCommandNamesOrdered(): string[] {
        return Object.keys(this.commands).sort();
    }
}

class CommandExecutor {
    private handler: any;
    private autocompleteHandler: any;
    private command: Command;

    constructor(command: Command, handler: CommandHandler, autocompleteHandler?: AutocompleteHandler) {
        this.command = command;
        this.handler = handler;
        this.autocompleteHandler = autocompleteHandler;
    }

    public execute(parsedCommand: ParsedCommand, additionalData: { [name: string]: any }): void {
        var context = {
            arguments: parsedCommand.arguments,
            additionalData: additionalData
        };

        if (typeof this.handler === 'function') {
            this.handler(context);
        } else {
            this.handler.executeCommand(context);
        }
    }

    public getArgumentName(index: number): string {
        if (!this.command.arguments || this.command.arguments.length <= index) {
            return undefined;
        }

        return this.command.arguments[index].name;
    }

    public autocomplete(args: any[]): string[] {
        if (this.autocompleteHandler) {
            if (typeof this.autocompleteHandler === 'function') {
                return this.autocompleteHandler(args);
            }
            else {
                return this.autocompleteHandler.autocomplete(args);
            }
        }

        return [];
    }

    /**
     * Prints the help text for the command.
     * @param  {boolean} extended if true informations for all parameters will be added.
     * @return {string}           the help text.
     */
    public help(extended: boolean): string {
        var helpText = `**${this.command.command} ${this.commandParamsToString()} **- ${this.command.helpText}`

        if (extended && this.command.arguments && this.command.arguments.length > 0) {
            helpText += '\n\n### Arguments\n';

            helpText += this.command.arguments.map((param) => {
                let paramHelpText = '';

                if (param.required) {
                    paramHelpText += `**${param.name}**`;
                }
                else {
                    paramHelpText += `**[${param.name}]**`;
                }

                paramHelpText += ` - ${param.helpText}`;

                return paramHelpText;
            }).join('\n\n');
        }

        return helpText;
    }

    private commandParamsToString(): string {
        if (!this.command.arguments || this.command.arguments.length === 0) {
            return '';
        }

        return this.command.arguments.map((param) => {
            if (param.required) {
                return `_${param.name}_`;
            }
            else {
                return `[_${param.name}_]`;
            }
        }).join(' ');
    }
}
