export declare type Fun = (...args: any) => any;
export declare type ConfirmFunction = (message: any, callback: Fun) => ReturnType<typeof callback>;
export interface BrowserProps {
    basename: string;
    keyLength: number;
    forceRefresh: boolean;
    getUserConfirmation: ConfirmFunction;
}
