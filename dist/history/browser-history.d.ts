import { BrowserProps } from './props.type';
declare type Action = 'POP' | 'PUSH' | 'REPLACE';
export interface History {
    readonly length: number;
    readonly action: Action;
    push: Function;
    block: Function;
    goBack: Function;
    listen: Function;
    replace: Function;
    goForward: Function;
    createHref: Function;
    go: (n: number) => void;
}
export declare function createBrowserHistory(props: BrowserProps): History;
export {};
