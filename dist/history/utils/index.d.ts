import { Location } from '../type';
export * from './dom';
export * from './path';
export declare function warning(condition: any, message: string): void;
export declare function createKey(l: number): string;
export declare function assertParams(path: string | any, state?: Object): void;
export declare function valueEqual(a: any, b: any): boolean;
export declare function locationsAreEqual(a: Location, b: Location): boolean;
export declare function createLocation(path?: string | Location, state?: any, key?: string, currrentLocation?: Location): Location;
