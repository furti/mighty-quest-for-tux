import * as React from 'react';
import {Component} from 'react';
import * as classNames from 'classnames';


import {AutocompleteViewProps} from './AutocompleteViewProps';
import {AutocompleteViewState} from './AutocompleteViewState';


export class AutocompleteView extends Component<AutocompleteViewProps, AutocompleteViewState> {
    constructor() {
        super();

        this.state = {
            visible: false,
            selected: 0,
            possibleCommands: []
        };
    }

    /**
     * Displays the autocomplete with all the possible commands
     * @param possibleCommands: string[] List of possible commands
     */
    public show(possibleCommands: string[]): void {
        if (possibleCommands && possibleCommands.length > 0) {
            this.setState({
                visible: true,
                selected: possibleCommands.length - 1,
                possibleCommands: possibleCommands.reverse()
            });
        }
        else {
            this.setState({
                visible: false,
                selected: 0,
                possibleCommands: []
            });
        }
    }

    /**
     * Hide the autocomplete choices.
     */
    public hide(): void {
        this.setState({
            visible: false,
            selected: 0,
            possibleCommands: []
        });
    }

    /**
     * Select the next entry in the list. If the last entry is the current one the first one will be selected.
     */
    public selectPrevious(): void {
        var nextIndex = this.state.selected + 1;

        if (nextIndex >= this.state.possibleCommands.length) {
            nextIndex = 0;
        }

        this.setState({
            selected: nextIndex
        });
    }

    /**
     * Select the previous entry in the list. If the first entry is the current one the last one will be selected.
     */
    public selectNext(): void {
        var nextIndex = this.state.selected - 1;

        if (nextIndex === -1) {
            nextIndex = this.state.possibleCommands.length - 1;
        }

        this.setState({
            selected: nextIndex
        });
    }

    /**
     * @return {string} The current selected choice
     */
    public getCurrentValue(): string {
        return this.state.possibleCommands[this.state.selected];
    }

    /**
     * Checks if the autocomplete choices are visible right now.
     * @return {Boolean} true when visible. False otherwise.
     */
    public isVisible(): boolean {
        return this.state.visible;
    }

    render() {
        var classes = classNames('autocomplete', {
            'hide': !this.state.visible
        });

        return <div className={classes}>
            <ul>
                {
                    this.state.possibleCommands.map((line, index) => {
                        var classes = classNames('autocomplete-entry', {
                            'active': this.state.selected === index
                        });

                        return <li key={"autocomplete-entry-" + index} className={classes}>{line}</li>
                    })
                }
            </ul>
        </div>
    }
}
