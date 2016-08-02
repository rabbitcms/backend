import "jquery.cookie";
import { Metronic, BlockUIOptions, MetronicOptions } from "rabbitcms/metronic";
export interface RabbitCMSOptions extends MetronicOptions {
    handlers?: Handler[];
}
export declare class State {
    link: string;
    handler: Handler;
    checkers: ((replay: ReplayFunc) => Promise<void>)[];
    widget: JQuery;
    constructor(link: string, handler: Handler, widget: JQuery);
    check(replay: ReplayFunc): Promise<void[]>;
    addChecker(checker: (replay: ReplayFunc) => Promise<void>): void;
}
export declare enum StateType {
    NoPush = 0,
    None = 1,
    Push = 2,
    Replace = 3,
}
export interface ReplayFunc {
    (): void;
}
export interface AjaxSettings extends JQueryAjaxSettings {
    warningTarget?: JQuery;
    blockTarget?: JQuery;
    blockOptions?: BlockUIOptions;
}
export declare class RabbitCMS extends Metronic {
    private static _stack;
    private static menu;
    private static _locale;
    private static _handlers;
    static init(options?: RabbitCMSOptions): void;
    static ready(): void;
    static findHandler(link: string): Handler;
    static setToken(value: string): void;
    static getToken(): string;
    static setLocale(locale: string): void;
    static getLocale(map?: Map<string, string>): string;
    static loadModuleByHandler(handler: Handler, widget: JQuery, state: State): void;
    static loadModule(widget: JQuery): void;
    static navigateByHandler(h: Handler, link: string, pushState: StateType, replay: ReplayFunc): Promise<boolean>;
    static navigate(link: string, pushState?: StateType, replay?: ReplayFunc): Promise<boolean>;
    static showPortlet(h: Handler, widget: JQuery): boolean;
    static loadModalWindow(link: string, callback: (model: JQuery, data: any, textStatus: string, jqXHR: JQueryXHR) => any): void;
    static showModal(modal: JQuery): void;
    static getUniqueID(prefix?: string): string;
    static alert(options: any): string;
    static message(options: any): void;
    static dangerMessage(message: string, target?: JQuery): void;
    static getViewPort(): {
        width: number;
        height: number;
    };
    static initSidebar(): void;
    static setMenu(menu: string): void;
    static ajax(options: AjaxSettings): JQueryXHR;
}
export declare class Dialogs {
    static confirm(message: string, options?: BootboxDialogOptions): Promise<void>;
    static onDelete(ajax: AjaxSettings, message?: string, options?: BootboxDialogOptions): Promise<void>;
}
export declare class Tools {
    static transliterate(string: string, spase?: string): string;
}
export declare class MicroEvent {
    private _events;
    constructor(object?: Object);
    bind(event: string, fct: any): void;
    unbind(event: string, fct: any): void;
    trigger(event: string, ...args: any[]): void;
}
export interface Handler {
    handler: string;
    regex?: RegExp;
    module: string;
    exec?: string;
    ajax?: boolean;
    pushState?: StateType;
    permanent?: boolean;
    widget?: JQuery;
    menuPath?: string;
}
export interface ValidationOptions extends JQueryValidation.ValidationOptions {
    completeSubmit?: () => void;
}
