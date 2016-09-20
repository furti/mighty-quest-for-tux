import { console } from '../console';

namespace intro.credits {
    export function run(commandParams: console.CommandParams): void {
        commandParams.console.executeCommand('less credits.md');
    }
}