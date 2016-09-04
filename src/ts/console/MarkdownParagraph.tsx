import * as React from 'react';
import {Component} from 'react';
import * as marked from 'marked';

import {MarkdownParagraphProps} from './MarkdownParagraphProps';

export class MarkdownParagraph extends Component<MarkdownParagraphProps, {}>{


    private renderedContent: string;

    public renderContent(): string {
        if (!this.renderedContent) {
            this.renderedContent = marked(this.props.markdownContent, {
                gfm: true,
                breaks: true
            });
        }

        return this.renderedContent;
    }

    render(): JSX.Element {
        return <div className={this.props.className} dangerouslySetInnerHTML={{ __html: this.renderContent() }}></div>
    }
}
