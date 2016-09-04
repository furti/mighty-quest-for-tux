import { ParsedCommand } from './ParsedCommand';
import { ConsoleEvent } from './ConsoleEvent';
import { Events } from './Events';

export class ConsoleEventRegistrar {
    constructor(private events: Events) {

    }

    public commandExecuted(handler: (event?: ParsedCommand) => void): void {
        this.events.on(ConsoleEvent.COMMAND_EXECUTED, handler);
    }

    public close(handler: () => void): void {
        this.events.on(ConsoleEvent.CLOSE, handler);
    }
}