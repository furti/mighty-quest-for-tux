import { Props, KeyboardEvent } from 'react';

import { ResizeableTextarea } from './ResizeableTextarea';

export interface ResizeableTextareaProps extends Props<ResizeableTextarea> {
    onKeyUp: (event: KeyboardEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
}
