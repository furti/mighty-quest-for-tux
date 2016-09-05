namespace intro.credits {
    export function run(commandParams: console.CommandParams): void {
        commandParams.console.executeCommand('read credits.md');
    }
}