export declare const canUseDOM: boolean;
export declare function getConfirmation(message: string, callback: (ok: boolean) => never): void;
export declare function supportsHistory(): boolean;
export declare function supportsPopStateOnHashChange(): boolean;
export declare function supportsGoWithoutReloadUsingHash(): boolean;
export declare function isExtraneousPopstateEvent(event: PopStateEvent): boolean;
