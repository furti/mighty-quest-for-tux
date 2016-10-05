import { console } from '../console';

namespace blueberry.tomcat {
    interface Application {
        name: string;
        used: string;
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const applications = [
        {
            name: 'fraser',
            used: random(100, 800) + 'MB'
        }, {
            name: 'fergus',
            used: random(100, 800) + 'MB'
        }, {
            name: 'alister',
            used: random(440, 470) + 'MB'
        }, {
            name: 'carson',
            used: random(100, 800) + 'MB'
        }
    ];

    function colorize(application: Application, applicationMemory: string): string {
        let memoryUnit = applicationMemory.substring(applicationMemory.length - 2);
        let memoryValue = parseInt(applicationMemory.substring(0, applicationMemory.length - 2));

        let usedUnit = application.used.substring(application.used.length - 2);
        let usedValue = parseInt(application.used.substring(0, application.used.length - 2));


        let memory = memoryUnit === 'GB' ? memoryValue * 1024 : memoryValue;
        let used = usedUnit === 'GB' ? usedValue * 1024 : usedValue;

        if (memory - used > 100) {
            return `[green]${application.used}[/green]`;
        }
        else {
            return `[red]${application.used}[/red]`;
        }
    }

    export function run(commandParams: console.CommandParams): void {
        let console = commandParams.console;

        if (commandParams.arguments[0] === 'status') {
            applications.forEach(application => {
                let content = console.getFile(`${application.name}-config.json`).content;

                let config = JSON.parse(content);

                console.printLine(`${application.name} - ${colorize(application, config.memory)} / ${config.memory}`);
            });
        }
        else if (commandParams.arguments[0] === 'restart') {
            let application: string = commandParams.arguments[1];

            console.runTimed([
                `Parse config for application ${application}`,

                (event: console.ConsoleTimedEvent) => {
                    let configFile = console.getFile(`${application}-config.json`);

                    if (!configFile) {
                        event.cancel();

                        return `[red]Application ${application} does not exist[/red]`;
                    }
                    else {
                        event.setProperty('config', JSON.parse(configFile.content));
                    }
                },

                `Shutting down application ${application}`,

                `Waiting for application to free ports`,

                `Applying new configuration`,

                `Starting application ${application}`,

                (event: console.ConsoleTimedEvent) => {
                    let config: any = event.getProperty('config');

                    if (application !== 'alister') {
                        event.cancel();
                        return `[red]D'OH! You restarted the wrong application.
                        <b>Don't restart healthy applications in a production environment!!</b>[/red]`;
                    }

                    if (config.memory !== '1GB') {
                        event.cancel();

                        return `[red]Maybe you should check the memory for the application again. It seems that it is not set to the asked value![/red]`;
                    }
                }
            ], 1000).then((event: console.ConsoleTimedEvent) => {
                console.printLine('[green]Well done. You reconfigured the application. Everything is running fine now.[/green]');

                console.printLine('Type **disconnect** to leave the server.');

                console.fire('level.complete', 'blueberry');
            });
        }
        else {
            console.printLine(`Unknown argument ${commandParams.arguments[0]}`);
        }
    }
}