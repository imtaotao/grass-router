import { Action, Location, ConfirmFunction } from './type';
declare type PromptFunction = (location: Location, action: Action) => string | boolean;
export declare type Prompt = null | boolean | PromptFunction;
export default function (): {
    setPrompt: (nextPrompt: Prompt) => Function;
    appendListener: (fn: Function) => Function;
    notifyListeners: (...args: any[]) => void;
    confirmTransitionTo: (location: Location, action: Action, getUserConfirmation: ConfirmFunction, callback: (ok: boolean) => void) => void;
};
export {};
