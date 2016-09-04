export interface ConsoleFile {
    /**
     * The files content
     */
    content: string;
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
