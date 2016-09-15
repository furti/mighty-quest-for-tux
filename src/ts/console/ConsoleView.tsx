import * as React from 'react';
import {Component} from 'react';
import * as CodeMirror from 'codemirror';

import {ConsoleViewProps} from './ConsoleViewProps';
import {ConsoleViewState} from './ConsoleViewState';
import {AutocompleteView} from './AutocompleteView';
import {ResizeableTextarea} from './ResizeableTextarea';
import {ConsoleContext} from './ConsoleContext';
import {Key} from './hotkeys/Key';
import {MarkdownParagraph} from './MarkdownParagraph';


/**
 * The visual representation of the 
 */
export class ConsoleView extends Component<ConsoleViewProps, ConsoleViewState> {
    private scrollTimeout: number;
    private textarea: ResizeableTextarea;
    private autocomplete: AutocompleteView;
    private linesContainer: HTMLDivElement;
    private codeMirror: CodeMirror.EditorFromTextArea;

    constructor() {
        super();

        this.state = {
            context: null
        };
    }

    /**
     * Set The focus to the command input
     */
    public focusInput(): void {
        if (this.textarea && !this.state.context.config.editable) {
            this.textarea.focus();
        }
    }

    public setContext(context: ConsoleContext): void {
        this.setState({
            context: context
        });
    }

    public scrollTop(): void {
        if (this.scrollTimeout) {
            window.clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = window.setTimeout(() => this.linesContainer.scrollTop = 0, 1);
    }

    public scrollBottom(): void {
        if (this.scrollTimeout) {
            window.clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = window.setTimeout(() => this.linesContainer.scrollTop = this.linesContainer.scrollHeight, 1);
    }

    private handleUp(e: React.KeyboardEvent): void {
        var textarea = e.target as HTMLTextAreaElement;

        if (e.keyCode === Key.ENTER) {
            if (this.autocomplete.isVisible()) {
                /*
                 * When the autocomplete is shown we have to take the currently selected value.
                 * No need to execute the command.
                 */
                textarea.value = this.autocomplete.getCurrentValue();
                this.autocomplete.hide();
            }
            else if (textarea.value.trim().length > 0) {
                //Enter pressed and we have some text --> execute the command
                this.printActualValue(textarea.value);
                this.state.context.executeCommand(textarea.value);
                textarea.value = '';
            }
        }
        else if (e.keyCode === Key.C && e.ctrlKey) {
            this.printActualValue(textarea.value);
            textarea.value = '';
        }
        else if (e.keyCode === Key.TAB) {
            var choices = this.state.context.autocomplete(textarea.value);

            if (choices && choices.length === 1) {
                textarea.value = choices[0];
                this.autocomplete.hide();
            }
            else {
                this.autocomplete.show(choices);
            }
        }
        else if (e.keyCode === Key.ESC) {
            if (this.autocomplete.isVisible()) {
                this.autocomplete.hide();
            }
        }
        else if (e.keyCode === Key.UP) {
            if (this.autocomplete.isVisible()) {
                this.autocomplete.selectNext();
            }
        }
        else if (e.keyCode === Key.DOWN) {
            if (this.autocomplete.isVisible()) {
                this.autocomplete.selectPrevious();
            }
        }
    }

    private printActualValue(actualValue: string) {
        this.state.context.lines.push(`$ ${actualValue}`);
        this.forceUpdate();
        this.focusInput();
    }

    private handleDown(e: React.KeyboardEvent): void {
        //Prevent the default action for some key combinations
        if (e.keyCode === Key.ENTER || e.keyCode === Key.TAB || e.ctrlKey || e.keyCode === Key.ESC ||
            e.keyCode === Key.UP || e.keyCode === Key.DOWN) {
            e.preventDefault();
        }
    }

    private connectLinesContainer(linesContainer: HTMLDivElement): void {
        if (linesContainer) {
            this.linesContainer = linesContainer;
        }
    }

    private connectEditor(textarea: HTMLTextAreaElement): void {
        if (textarea) {
            let config = this.state.context.config;

            this.codeMirror = CodeMirror.fromTextArea(textarea, {
                lineNumbers: true,
                autofocus: true,
                mode: config.editorMode,
                indentUnit: 4
            });

            if(config.initialContent) {
                this.codeMirror.setValue(config.initialContent);
            }
        }
    }

    render() {
        var lines = this.state.context && this.state.context.lines ? this.state.context.lines : [];

        return <div className="console" onClick={(e) => this.focusInput() } >
            {
                (() => {
                    if (this.state.context && this.state.context.config.editable) {
                        return <div className="console-editor">
                            <textarea ref={(textarea: HTMLTextAreaElement) => this.connectEditor(textarea) }></textarea>
                        </div>
                    }
                    else {
                        return <div className="console-lines" ref={(linesContainer) => this.connectLinesContainer(linesContainer) }>
                            {

                                lines.map((line, index) => {
                                    return <MarkdownParagraph key={this.state.context.id + "-line-" + index} markdownContent={line} className="console-line"></MarkdownParagraph>
                                })
                            }
                        </div>
                    }
                })()
            }
            {
                (() => {
                    if (this.state.context && this.state.context.config.showInput) {
                        return <div className="console-input">
                            <AutocompleteView ref={(autocomplete: AutocompleteView) => this.autocomplete = autocomplete}></AutocompleteView>
                            <div className="input-container">
                                <span className="prompt">$</span>
                                <ResizeableTextarea onKeyUp={(event) => this.handleUp(event) } onKeyDown={(event) => this.handleDown(event) } ref={(textarea: ResizeableTextarea) => this.textarea = textarea}></ResizeableTextarea>
                            </div>
                        </div>
                    }
                })()
            }

        </div>
    }
}
