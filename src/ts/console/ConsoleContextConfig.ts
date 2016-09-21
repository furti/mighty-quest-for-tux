
export interface ConsoleContextConfig {
    showInput: boolean;
    editable: boolean;

    initialContent?: string;
    /**
     * Language used for the editor when in editable mode.
     * See http://codemirror.net/mode/index.html for further details
     */
    editorMode?: any;

    /**
     * callback called by the context when the content of the file changes
     */
    onFileChange?(change: CodeMirror.EditorChangeLinkedList): void;
}