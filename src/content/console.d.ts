import { Command as importedCommand } from '../ts/console/Command';
import { CommandParams as importedParams } from '../ts/console/CommandParams';
import { Console as importedConsole } from '../ts/console/Console';
import { ConsoleTimedEvent as importedTimedEvent } from '../ts/console/ConsoleTimedEvent';
import { ConsoleContext as importedConsoleContext } from '../ts/console/ConsoleContext';
import { LevelManager as importedLevelManager, SavedLevel as importedSavedLevel } from '../ts/LevelManager';

declare module console {
    export type Command = importedCommand;
    export type CommandParams = importedParams;
    export type Console = importedConsole;
    export type ConsoleTimedEvent = importedTimedEvent;
    export type ConsoleContext = importedConsoleContext;
    export type LevelManager = importedLevelManager;
    export type SavedLevel = importedSavedLevel;
}