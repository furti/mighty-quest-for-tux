import { console } from '../console';

namespace blueberry.status {
    interface Application {
        name: string;
        memory: string;
        used: string;
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const applications = [
        {
            name: 'fraser',
            memory: '1GB',
            used: random(100, 800) + 'MB'
        }, {
            name: 'fergus',
            memory: '1GB',
            used: random(100, 800) + 'MB'
        }, {
            name: 'alister',
            memory: '500MB',
            used: random(440, 470) + 'MB'
        }, {
            name: 'carson',
            memory: '1GB',
            used: random(100, 800) + 'MB'
        }
    ];

    function colorize(application: Application): string {
        let memoryUnit = application.memory.substring(application.memory.length - 2);
        let memoryValue = parseInt(application.memory.substring(0, application.memory.length - 2));

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

        applications.forEach(application => {
            console.printLine(`${application.name} - ${colorize(application)} / ${application.memory}`);
        });
    }
}