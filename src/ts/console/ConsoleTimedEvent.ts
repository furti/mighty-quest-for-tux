export class ConsoleTimedEvent {
    private canceled = false;
    private properties: { [name: string]: any };

    constructor() {
        this.properties = {};
    }

    public cancel(): void {
        this.canceled = true;
    }

    public isCanceled(): boolean {
        return this.canceled;
    }

    public setProperty(name: string, value: any): void {
        this.properties[name] = value;
    }

    public getProperty<TYPE>(name: string): TYPE {
        return this.properties[name];
    }
}