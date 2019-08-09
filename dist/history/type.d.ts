import { Prompt } from './transition-manager';
export declare type ConfirmFunction = (message: string, callback: (ok: boolean) => void) => ReturnType<typeof callback>;
export declare type Action = 'POP' | 'PUSH' | 'REPLACE';
export interface BrowserProps {
    basename?: string;
    keyLength?: number;
    forceRefresh?: boolean;
    getUserConfirmation?: ConfirmFunction;
}
export interface Location {
    key?: string;
    hash: string;
    state: any;
    search: string;
    pathname: string;
}
export interface HistoryState {
    key?: string;
    state?: any;
}
export interface BrowserHistory {
    action: Action;
    length: number;
    location: Location;
    goBack: () => void;
    goForward: () => void;
    go: (n: number) => void;
    block: (prompt: Prompt) => Function;
    listen: (listener: Function) => Function;
    createHref: (location: Location) => string;
    push: (path: string | any, state?: any) => void;
    replace: (path: string | any, state?: any) => void;
}
