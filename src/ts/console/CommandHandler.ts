import { CommandExecutionContext } from './CommandExecutionContext';

export type CommandHandler = ((context: CommandExecutionContext) => void) | { executeCommand: (context: CommandExecutionContext) => void };
