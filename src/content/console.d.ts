import { Command as importedCommand } from '../ts/console/Command';
import { CommandParams as importedParams } from '../ts/console/CommandParams';
import { Console as importedConsole } from '../ts/console/Console';
import { ConsoleContext as importedConsoleContext } from '../ts/console/ConsoleContext';

declare module console {
    export type Command = importedCommand;
    export type CommandParams = importedParams;
    export type Console = importedConsole;
    export type ConsoleContext = importedConsoleContext;
}