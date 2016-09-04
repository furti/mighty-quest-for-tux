export class Logger {

    public static debug(group: string, message: string, ...params: any[]) {
        window.console.debug(`${group}: ${message}`, params);
    }

    public static info(group: string, message: string, ...params: any[]) {
        window.console.info(`${group}: ${message}`, params);
    }

    public static warn(group: string, message: string, ...params: any[]) {
        window.console.warn(`${group}: ${message}`, params);
    }

    public static error(group: string, message: string, ...params: any[]) {
        window.console.error(`${group}: ${message}`, params);
    }
}