export declare type ConfirmFunction = (message: string, callback: (ok: boolean) => never) => ReturnType<typeof callback>;
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
