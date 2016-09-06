import * as React from 'react'
import {Promise, Deferred, defer, all} from 'q'

import {Executable} from './Executable'
import {ConsoleContext} from './ConsoleContext'
import {ConsoleEventRegistrar} from './ConsoleEventRegistrar'
import {ConsoleFile} from './ConsoleFile'
import {ConsoleView} from './ConsoleView'
import {Events} from './Events'
import {Base64} from './Base64'
import {ConsoleEvent} from './ConsoleEvent'
import {ConsoleExecutableHandler} from './ConsoleExecutableHandler'
import {ConsoleContextConfig} from './ConsoleContextConfig'
import {Http} from './http/Http'

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
    private content: ConsoleContent;
    private contexts: ConsoleContext[];
    public events: Events;
    public on: ConsoleEventRegistrar;

    /**
     * Constructs a new console with the given name.
     * @param  {string} consoleName The name of the console is used to load the content for the console from the server. The URL constructed is /console/<consoleName>.
     * @return {Console}            The Console.
     */
    constructor(basePath: string) {
        this.basePath = basePath;
        this.contexts = [];
        this.events = new Events();
        this.on = new ConsoleEventRegistrar(this.events);
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
                showInput: true
            });

            this.registerDefaultCommands();
        }).then((resolvedData: any[]) => {
            this.content = resolvedData[0];
            this.registerExecutables();
            this.printWelcome();
            this.consoleDeferred.resolve(this);
        }, (errorMessage: string) => {
            this.printLine(errorMessage);
            this.consoleDeferred.reject(this);
        });

        return this.consoleDeferred.promise;
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
        return this.content.files[fileName];
    }

    /**
     * Returns a list of all files inside the console.
     * @return {ConsoleFile[]} List of files
     */
    public getFiles(): ConsoleFile[] {
        if (!this.content.files) {
            return [];
        }

        var files: ConsoleFile[] = [];

        for (let fileName of Object.getOwnPropertyNames(this.content.files)) {
            files.push(this.content.files[fileName]);
        }

        return files;
    }

    /**
     * Prints a line on the console.
     * @param {string} line the text to print to the console
     */
    public printLine(line: string): void {
        this.getCurrentContext().lines.push(line);
        this.rerenderView();
        this.consoleView.scrollBottom();
    }

    public printFile(fileName: string): void {
        var file = this.getFile(fileName);

        if (file) {
            this.printLine(Base64.decode(file.content));
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
            this.contexts.pop();
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

    private getCurrentContext(): ConsoleContext {
        return this.contexts[this.contexts.length - 1];
    }

    /**
     * Prints the welcome text if available.
     */
    private printWelcome(): void {
        if (this.content.welcome) {
            this.printLine(Base64.decode(this.content.welcome));
        }
    }

    /**
     * Iterate over all executables and register them on the ConsoleEngine;
     * @return {[type]} [description]
     */
    private registerExecutables(): void {
        if (this.content.executables) {
            var currentContext = this.getCurrentContext();

            for (let executable of this.content.executables) {
                currentContext.registerCommand(executable,
                    new ConsoleExecutableHandler(this, executable));
            }
        }
    }

    private registerDefaultCommands(): void {
        var currentContext = this.getCurrentContext();

        var cat = new commands.Cat(this);
        currentContext.registerCommand(commands.Cat.command, cat, cat);
        currentContext.registerCommand(commands.Ls.command, new commands.Ls(this));
    }

    /**
     * Displays the console on the screen and sets up all event handlers.
     *
     * It also displays the Text Loading... until the content is loaded.
     */
    private show(): void {
        this.consoleConnected = defer<void>();
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

/**
 * Contains all the files and folders for a console instance.
 */
interface ConsoleContent {
    /**
     * Markdown String that should be shown on startup.
     */
    welcome?: string;

    /**
     * List of Executable scripts for the console.
     *
     * @type {Executable}
     */
    executables: Executable[];

    /**
     * All files contained in the console;
     * @type {ConsoleFile}
     */
    files: { [fileName: string]: ConsoleFile };
}
