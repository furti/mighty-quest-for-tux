export interface ConsoleFile {
    /**
     * The files content. The actual type depends on the files type. String or binary data.
     */
    content: any;
    /**
     * The files name without extension.
     */
    name: string;
    /**
     * The files extension
     */
    ext: string;
    /**
     * The filename + extension.
     */
    base: string;

    readable: boolean;
    writeable: boolean;
    executable: boolean;
}
