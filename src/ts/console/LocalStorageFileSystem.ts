import { Base64 } from './Base64';
import { FileSystem } from './FileSystem';
import { ConsoleFile } from './ConsoleFile';

export class LocalStorageFileSystem implements FileSystem {
    private files: { [fileName: string]: ConsoleFile };

    public init(files: { [fileName: string]: ConsoleFile }): void {
        this.files = files;
    }

    public getFile(fileName: string): ConsoleFile {
        if (!this.files) {
            return;
        }

        let file = this.files[fileName];

        if (!file) {
            return;
        }

        let base64Content = this.findUpdatedContent(fileName) || file.content;

        return {
            name: file.name,
            base: file.base,
            content: Base64.decode(base64Content),
            executable: file.executable,
            ext: file.ext,
            readable: file.readable,
            writeable: file.writeable
        }
    }

    public listFiles(): ConsoleFile[] {
        if (!this.files) {
            return [];
        }

        let copy: ConsoleFile[] = [];

        for (let fileName in this.files) {
            copy.push(this.getFile(fileName));
        }

        return copy;
    }

    public saveFile(fileName: string, content: any): void {
        if (!content) {
            localStorage.removeItem(`console-file-content:${fileName}`);
        }
        else {
            localStorage.setItem(`console-file-content:${fileName}`, Base64.encode(content));
        }
    }

    /**
     * The actual implementation can check for an up to date file content if available.
     * When this method returns null or undefined the default content is used. 
     * 
     * @protected
     * @abstract
     * @param {string} fileName the name of the file to search for
     * @returns {string} base64 encoded file content or null.
     * 
     * @memberOf FileSystemBase
     */
    protected findUpdatedContent(fileName: string): string {
        return localStorage.getItem(`console-file-content:${fileName}`);
    }
}