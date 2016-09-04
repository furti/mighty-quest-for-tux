import { CommandExecutionState } from './CommandExecutionState';
import { ParsedCommand } from './ParsedCommand';

export interface CommandExecutionResult {
    state: CommandExecutionState;
    message?: string;
    command?: ParsedCommand;
}
