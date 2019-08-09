import { Location } from '../type';
export declare function isAbsolute(path: string): boolean;
export declare function addLeadingSlash(path: string): string;
export declare function stripLeadingSlash(path: string): string;
export declare function hasBasename(path: string, prefix: string): boolean;
export declare function stripBasename(path: string, prefix: string): string;
export declare function stripTrailingSlash(path: string): string;
export declare function spliceOne(list: Array<any>, index: number): void;
export declare function parsePath(path: string): {
    hash: string;
    search: string;
    pathname: string;
};
export declare function createPath(location: Location): string;
export declare function resolvePathname(to?: string, from?: string): string;
