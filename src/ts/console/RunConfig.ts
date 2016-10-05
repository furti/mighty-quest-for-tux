import { CommandExecutionContext } from './CommandExecutionContext';
import { Console } from './Console';

export interface RunConfig {
    scripts: string[];
    runNamespace: string;
    console: Console;
    context: CommandExecutionContext;
    additionalData?: { [name: string]: any };
}
