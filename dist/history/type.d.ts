export declare type Fn = (...args: any) => any;
export declare type ConfirmFunction = (message: any, callback: Fn) => ReturnType<typeof callback>;
export interface BrowserProps {
    basename: string;
    keyLength: number;
    forceRefresh: boolean;
    getUserConfirmation: ConfirmFunction;
}
export interface Location {
    state: any;
    key?: string;
    hash: string;
    search: string;
    pathname: string;
}
