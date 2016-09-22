import { FileSystemBase } from './FileSystemBase';

export class DefaultFileSystem extends FileSystemBase {

    protected findUpdatedContent(fileName: string): string {
        return null;
    }
}