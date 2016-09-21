import * as React from 'react';
import {Component} from 'react';
import * as marked from 'marked';

import {MarkdownParagraphProps} from './MarkdownParagraphProps';
import {Logger} from './Logger';

const markdownRenderer = new marked.Renderer();

markdownRenderer.paragraph = (text): string => {
    Logger.debug('Markdown', text);

    return MarkdownParagraphParser.parse(text);
}

export class MarkdownParagraph extends Component<MarkdownParagraphProps, {}>{


    private renderedContent: string;

    public renderContent(): string {
        if (!this.props.markdownContent) {
            return '';
        }

        if (!this.renderedContent) {
            this.renderedContent = marked(this.props.markdownContent, {
                gfm: true,
                breaks: true,
                renderer: markdownRenderer
            });
        }

        return this.renderedContent;
    }

    protected shouldComponentUpdate(nextProps: MarkdownParagraphProps, nextState: {}, nextContext: any): boolean {
        if (!nextProps || !this.props) {
            return false;
        }

        let update = this.props.markdownContent !== nextProps.markdownContent;

        if (update) {
            this.renderedContent = null;
        }

        return update;
    }

    render(): JSX.Element {
        return <div className={this.props.className} dangerouslySetInnerHTML={{ __html: this.renderContent() }}></div>
    }
}
