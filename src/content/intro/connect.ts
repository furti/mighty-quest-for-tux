import { console } from '../console';

namespace intro.connect {
    interface Server {
        name: string;
        description: string,
        folder: string;
    }

    let servers: Server[] = [{
        name: 'blueberry',
        description: '',
        folder: 'blueberry'
    }];

    class Connect {
        private console: console.Console;

        constructor(private commandParams: console.CommandParams) {
            this.console = commandParams.console;
        }

        public start(): void {
            let consoleContext = this.console.startContext({
                showInput: true
            });

            this.registerCommands(consoleContext);

            this.printContent();
        }

        private printContent(): void {
            this.console.printLine('# Available servers');
            this.console.printLine(`Enter the name of the server in the textfield below and press the enter key to connect to the server.`);
            this.console.printLine('');

            let serverList = servers.map(server => `1. servername: ${server.name} - ${server.description}`).join('\n');

            this.console.printLine(serverList);
        }

        private registerCommands(consoleContext: console.ConsoleContext): void {
            consoleContext.registerCommand({
                command: 'quit',
                helpText: 'Return to the main screen'
            }, (context) => this.quit());

            servers.forEach(server => {
                consoleContext.registerCommand({
                    command: server.name,
                    helpText: server.description
                }, (context) => this.connectToServer(server));
            });
        }

        private quit(): void {
            this.console.closeCurrentContext();
        }

        private connectToServer(server: Server): void {
            this.quit();

            this.console.fire('server.connect', server.folder);
        }
    }

    export function run(commandParams: console.CommandParams): void {
        new Connect(commandParams).start();
    }
}