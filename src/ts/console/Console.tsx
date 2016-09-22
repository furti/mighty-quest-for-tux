import * as React from 'react'
import {Promise, Deferred, defer, all} from 'q'

import {Executable} from './Executable'
import {ConsoleContext} from './ConsoleContext'
import {ConsoleFile} from './ConsoleFile'
import {ConsoleView} from './ConsoleView'
import {Events} from './Events'
import {EventHandler} from './EventHandler'
import {Base64} from './Base64'
import {ConsoleEvent} from './ConsoleEvent'
import {ConsoleExecutableHandler} from './ConsoleExecutableHandler'
import {ConsoleContextConfig} from './ConsoleContextConfig'
import {Http} from './http/Http'
import {FileSystem} from './FileSystem'
import {LocalStorageFileSystem} from './LocalStorageFileSystem'
import {ConsoleContent} from './ConsoleContent'

import * as commands from './commands/AllCommands'

/**
 * The Console that is used for interacting with the user.
 *
 * Use the load method to load the content for the console.
 */
export class Console {
    private basePath: string;

    private consoleView: ConsoleView;
    private contentLoaded: Promise<ConsoleContent>;
    private consoleConnected: Deferred<void>;
    private consoleDeferred: Deferred<Console>;
    private running: boolean;
    private contexts: ConsoleContext[];
    private events: Events;
    private fileSystem: FileSystem;
    private welcomeText: string;

    /**
     * Constructs a new console with the given name.
     * @param  {string} consoleName The name of the console is used to load the content for the console from the server. The URL constructed is /console/<consoleName>.
     * @return {Console}            The Console.
     */
    constructor(basePath: string, fileSystem?: FileSystem) {
        this.basePath = basePath;
        this.contexts = [];
        this.events = new Events();
        this.fileSystem = fileSystem || new LocalStorageFileSystem();
    }

    /**
     * This method displays the console. This method can safely be called at any time.
     * It waits until the data is loaded and starts to display its content then.
     *
     * The Returned promise will be resolved when the console is ready for use.
     *
     * If the console is already running, the deferred will be returned.
     *
     * @param consoleName {string} the name of the console to start
     * @return {Promise<void>} the promise that gets resolved when the console is shown.
     */
    public start(consoleName: string): Promise<Console> {
        if (this.running) {
            return this.consoleDeferred.promise;
        }

        this.load(consoleName);
        this.consoleDeferred = defer<Console>();
        this.running = true;

        this.show();

        all<any>([this.contentLoaded, this.consoleConnected.promise]).finally(() => {
            this.startContext({
                showInput: true,
                editable: false
            });

            this.registerDefaultCommands();
        }).then((resolvedData: any[]) => {
            let context: ConsoleContent = resolvedData[0];
            this.welcomeText = context.welcome;
            this.fileSystem.init(context.files);
            this.registerExecutables(context.executables);
            this.printWelcome();
            this.consoleDeferred.resolve(this);
        }, (errorMessage: string) => {
            this.printLine(errorMessage);
            this.consoleDeferred.reject(this);
        });

        return this.consoleDeferred.promise;
    }

    public onClose(handler: EventHandler): void {
        this.on(ConsoleEvent.CLOSE, handler);
    }

    public onCommandExecuted(handler: EventHandler): void {
        this.on(ConsoleEvent.COMMAND_EXECUTED, handler);
    }

    public on(event: string, handler: EventHandler): void {
        this.events.on(event, handler);
    }

    public fire(event: string, data?: any): void {
        this.events.fire(event, data);
    }

    /**
     * Loads the content for the console.
     */
    private load(consoleName: string): void {
        var path = `${this.basePath}/${consoleName}/content.json`;

        var contentLoadDefered = defer<ConsoleContent>();
        this.contentLoaded = contentLoadDefered.promise;

        Http.get<ConsoleContent>(path)
            .execute()
            .then((response: ConsoleContent) => {
                contentLoadDefered.resolve(response);
            }, (errorMessage: string) => {
                contentLoadDefered.reject(errorMessage);
            });
    }

    public getFile(fileName: string): ConsoleFile {
        return this.fileSystem.getFile(fileName);
    }

    public saveFile(fileName: string, content: any): void {
        this.fileSystem.saveFile(fileName, content);
    }

    /**
     * Returns a list of all files inside the console.
     * @return {ConsoleFile[]} List of files
     */
    public getFiles(): ConsoleFile[] {
        return this.fileSystem.listFiles();
    }

    /**
     * Prints a line on the console.
     * @param {string} line the text to print to the console
     */
    public printLine(line: string): void {
        this.getCurrentContext().addLine(line);
        this.rerenderView();
        this.consoleView.scrollBottom();
    }

    public printFile(fileName: string): void {
        var file = this.getFile(fileName);

        if (file) {
            this.printLine(file.content);
        }
        else {
            this.printLine(`File ${fileName} not found!`);
        }
    }

    public executeCommand(command: string): void {
        this.getCurrentContext().executeCommand(command);
    }

    public scrollTop(): void {
        this.consoleView.scrollTop();
    }

    public close(): void {
        this.events.fire(ConsoleEvent.CLOSE);

        while (this.getCurrentContext()) {
            this.closeCurrentContext();
        }

        this.running = false;
    }

    public startContext(config: ConsoleContextConfig): ConsoleContext {
        var newContext = new ConsoleContext(this.contexts.length, this, config);

        this.contexts.push(newContext);
        this.setCurrentContext();

        return newContext;
    }

    /**
     * Removes the current context from the stack and renders the previous context.
     * The default context cannot be removed.
     */
    public closeCurrentContext(): void {
        if (this.contexts.length > 1) {
            this.contexts.pop().destroy();
            this.setCurrentContext();
        }
    }

    private rerenderView(): void {
        if (this.consoleView) {
            this.consoleView.forceUpdate();
            this.consoleView.focusInput();
        }
    }

    private setCurrentContext(): void {
        this.consoleView.setContext(this.getCurrentContext());
        this.rerenderView();
    }

    public getCurrentContext(): ConsoleContext {
        return this.contexts[this.contexts.length - 1];
    }

    /**
     * Prints the welcome text if available.
     */
    private printWelcome(): void {
        if (this.welcomeText) {
            this.printLine(Base64.decode(this.welcomeText));
        }
    }

    /**
     * Iterate over all executables and register them on the ConsoleEngine;
     * @return {[type]} [description]
     */
    private registerExecutables(executables: Executable[]): void {
        if (executables) {
            var currentContext = this.getCurrentContext();

            for (let executable of executables) {
                currentContext.registerCommand(executable, new ConsoleExecutableHandler(this, executable));
            }
        }
    }

    private registerDefaultCommands(): void {
        var currentContext = this.getCurrentContext();

        var less = new commands.Less(this);
        var vi = new commands.Vi(this);
        currentContext.registerCommand(commands.Less.command, less, less);
        currentContext.registerCommand(commands.Ls.command, new commands.Ls(this));
        currentContext.registerCommand(commands.Vi.command, vi, vi);
    }

    /**
     * Displays the console on the screen and sets up all event handlers.
     *
     * It also displays the Text Loading... until the content is loaded.
     */
    private show(): void {
        this.consoleConnected = defer<void>();

        if (this.consoleView) {
            this.consoleConnected.resolve();
        }
    }

    private connectConsoleView(consoleView: ConsoleView): void {
        if (consoleView) {
            this.consoleView = consoleView;
            this.consoleView.focusInput();
            this.consoleConnected.resolve();
        }
    }

    public render(): JSX.Element {
        return <ConsoleView ref={(consoleView: ConsoleView) => {
            this.connectConsoleView(consoleView);
        } }>
        </ConsoleView >;
    }
}
