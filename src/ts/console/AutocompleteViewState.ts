export interface AutocompleteViewState {
    visible?: boolean;

    /**
     * The index of the currently selected entry
     */
    selected?: number;
    possibleCommands?: string[];
}