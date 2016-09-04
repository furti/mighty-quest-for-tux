import * as React from 'react';
import { Component, FormEvent } from 'react';

import { ResizeableTextareaProps} from './ResizeableTextareaProps';
import { ResizeableTextareaState } from './ResizeableTextareaState';

export class ResizeableTextarea extends Component<ResizeableTextareaProps, ResizeableTextareaState> {
    private textarea: HTMLTextAreaElement;

    constructor() {
        super();
    }

    /**
     * Set the focus on the textarea;
     */
    public focus(): void {
        this.textarea.focus();
    }

    private setupTextarea(textarea: HTMLTextAreaElement): void {
        if (!this.textarea) {
            this.textarea = textarea;
        }
    }

    private handleChange(e: FormEvent): void {
        this.checkResize(e);
    }

    private checkResize(e: FormEvent): void {
        var textarea = e.target as HTMLTextAreaElement;
        textarea.style.minHeight = '0'; //At first reset the min height so that scroll height is computed right
        textarea.style.minHeight = textarea.scrollHeight + 'px';
    }

    render(): JSX.Element {
        return <textarea rows={1} onChange={(e) => this.handleChange(e) } onKeyUp={this.props.onKeyUp} onKeyDown={this.props.onKeyDown}
            ref={(textarea) => this.setupTextarea(textarea) }></textarea>
    }
}
