import * as I from '../type';
export declare function isAbsolute(path: string): boolean;
export declare function spliceOne(list: Array<any>, index: number): void;
export declare function parsePath(path: string): {
    hash: string;
    search: string;
    pathname: string;
};
export declare function createPath(location: I.Location): string;
export declare function resolvePathname(to?: string, from?: string): string;
