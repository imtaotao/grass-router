import { Action, Location, BrowserProps } from './type';
export interface History {
    readonly length: number;
    readonly action: Action;
    location: Location;
    push: (path: string | any, state?: Object) => void;
    block: Function;
    goBack: Function;
    listen: Function;
    replace: Function;
    goForward: Function;
    createHref: Function;
    go: (n: number) => void;
}
export declare function createBrowserHistory(props?: BrowserProps): History;
