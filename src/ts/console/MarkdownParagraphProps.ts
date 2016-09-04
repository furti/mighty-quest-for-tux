import { Props } from 'react';

import { MarkdownParagraph } from './MarkdownParagraph';

export interface MarkdownParagraphProps extends Props<MarkdownParagraph> {
    markdownContent: string;
    className: string;
}
