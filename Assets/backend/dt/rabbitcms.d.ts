/// <reference path="../../../typings/index.d.ts" />
declare module "select2" {}
declare module "jquery.select2" {}
declare module DataTables {
    interface LanguagePaginateSettings {
        page:string;
        pageOf:string;
    }
}

declare module "rabbitcms/backend" {
    export interface RabbitCMSOptions {
        handlers?: Handler[];
        path?: string;
    }
    export class State {
        link: string;
        handler: Handler;
        checkers: ((replay: ReplayFunc) => Promise<void>)[];
        widget: JQuery;
        constructor(link: string, handler: Handler, widget: JQuery);
        check(replay: ReplayFunc): Promise<void[]>;
        addChecker(checker: (replay: ReplayFunc) => Promise<void>): void;
    }
    export enum StateType {
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
        blockTarget?:JQuery;
        blockOptions?:BlockUIOptions;
    }
    export class RabbitCMS {
        private static _path;
        private static _stack;
        private static menu;
        static init(options?: RabbitCMSOptions): void;
        static ready(): void;
        static findHandler(link: string): Handler;
        static setPath(path: string): void;
        static getPath(): string
        static getLocale(map?:Map<string,string>):string;
        static setToken(value: string): void;
        static getToken(): string;
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
        static scrollTo(element?: JQuery, offset?: number): void;
        static scrollTop(): void;
        static getViewPort(): {
            width: any;
            eight: any;
        };
        static updatePlugins(target?: JQuery): void;
        static initSidebar(): void;
        static setMenu(menu: string): void;
        static blockUI(target?: JQuery | string, options?: BlockUIOptions): void;
        static unblockUI(target?: any): void;
        static submitForm(form: any, callback: any): void;
        static ajaxPost(link: string, data: Object, callback: any): void;
        static ajax(options: AjaxSettings): void;
        static validate(form: JQuery, options?: ValidationOptions): void;
        static Dialogs: {
            onDelete: (link: any, callback: any) => void;
            onConfirm: (message: any, callback: any) => void;
        };
        static select2(selector: JQuery, options?: Select2Options): void;
    }
    export class Tools {
        static transliterate(string: string, spase?: string): string;
    }
    export interface FormOptions {
        validation?: ValidationOptions;
        ajax?: AjaxSettings | boolean;
        completeSubmit: () => void;
        state?: State;
        dialog?: BootboxDialogOptions | boolean;
    }
    export class Form {
        private options;
        private form;
        private data;
        private match;
        constructor(form: JQuery, options?: FormOptions);
        syncOriginal(): void;
        getData(): string;
        submitForm(): void;
    }
    export class MicroEvent {
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
    export interface BlockUIOptions {
        message?: string;
        boxed?: boolean;
        animate?: boolean;
        iconOnly?: boolean;
        textOnly?: boolean;
        target?: JQuery | string;
        zIndex?: number;
        cenrerY?: boolean;
        overlayColor?: string;
    }
    export interface ValidationOptions extends JQueryValidation.ValidationOptions {
        completeSubmit?: () => void;
    }

    export class Dialogs {
        static confirm(message:string, options?:BootboxDialogOptions):Promise<void>;

        static onDelete(ajax:AjaxSettings, message?:string, options?:BootboxDialogOptions):Promise<void>;
    }
}


declare module "rabbitcms/datatable" {

    export interface DataTableOptions {
        dataTable?:DataTables.Settings;
        src?:string | JQuery;
        loadingMessage?:string;
        resetGroupActionInputOnSuccess?:boolean;
        filterApplyAction?:string;
        filterCancelAction?:string;
        onDataLoad?:(dataTable:DataTable) => void;
        onError?:(dataTable:DataTable) => void;
        onSuccess?:(dataTable:DataTable, response:DataTableResponseData) => void;
    }

    export interface DataTableResponseData {
        raw:number;
        recordsFiltered:number;
        recordsTotal:number;
        customActionMessage?:string;
        customActionStatus?:string;
        data:any[];
    }

    export class DataTable {
        tableOptions:DataTableOptions;
        dataTable:DataTables.DataTable;
        table:JQuery;
        tableContainer:JQuery;
        tableWrapper:JQuery;
        tableInitialized:boolean;

        constructor(options:DataTableOptions);

        submitFilter():void;

        resetFilter():void;

        getSelectedRowsCount():number;

        getSelectedRows():any[];

        setAjaxParam(name:any, value:any):void;

        addAjaxParam(name:any, value:any):void;

        clearAjaxParams():void;

        getDataTable():DataTables.DataTable;

        getTableWrapper():JQuery;

        gettableContainer():JQuery;

        getTable():JQuery;
    }

}

declare module "i18n!rabbitcms/nls/datatable" {
    var _default:{
        groupActions:string;
        ajaxRequestGeneralError:string;
        dataTable:DataTables.LanguageSettings;
    };
    export = _default;
}

declare module "i18n!rabbitcms/nls/backend" {

    var _default:{
        pageNotFound:string;
        accessDenied:string;
        youWantDeleteThis:string;

        save:string;
        dontSave:string;
        close:string;
        dataHasBeenModified:string;
        yes:string;
        no:string;
    };
    export = _default;
}
