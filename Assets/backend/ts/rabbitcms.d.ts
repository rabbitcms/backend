/// <reference path="../../../typings/index.d.ts" />

declare module DataTables {
    interface LanguagePaginateSettings {
        page:string;
        pageOf:string;
    }
}

declare module "rabbitcms.backend" {
    export interface Handler {
        handler:string;
        regex?:RegExp;
        module:string;
        exec?:string;
        ajax?:boolean;
        pushState?:boolean;
        permanent?:boolean;
        widget?:JQuery;
    }

    export interface BlockUIOptions {
        message?:string;
        boxed?:boolean;
        animate?:boolean;
        iconOnly?:boolean;
        textOnly?:boolean;
        target?:JQuery | string;
        zIndex?:number;
        cenrerY?:boolean;
        overlayColor?:string;
    }

    export interface ValidationOptions extends JQueryValidation.ValidationOptions {
        completeSubmit?:() => void;
    }

    export interface RabbitCMSOptions {
        handlers?:Handler[];
        path?:string;
    }

    export class RabbitCMS {
        static init(options?:RabbitCMSOptions):void;

        static ready():void;

        static getPath():string;

        static setToken(value:string):void;

        static getToken():string;

        static navigate(link:string, pushState?:boolean):boolean;

        static showPortlet(h:Handler, widget:JQuery):boolean;

        static loadModalWindow(link:any, callback:any):void;

        static showModal(modal:JQuery):void;

        static alert(options:any):string;

        static message(options:any):void;

        static dangerMessage(message:any, container?:any):void;

        static scrollTo(element?:JQuery, offset?:number):void;

        static scrollTop():void;

        static getViewPort():{
            width:any;
            eight:any;
        };

        static blockUI(target?:JQuery | string, options?:BlockUIOptions):void;

        static unblockUI(target?:any):void;

        static canSubmit:{
            _match:boolean;
            init():void;
            check(event:any):boolean;
        };

        static submitForm(form:any, callback:any):void;

        static ajax(link:string, callback:any):void;

        static ajaxPost(link:string, data:Object, callback:any):void;

        static validate(form:JQuery, options?:ValidationOptions):void;

        static Dialogs:{
            onDelete:(link:any, callback:any) => void;
            onConfirm:(message:any, callback:any) => void;
        };
        static Tools:{
            transliterate:(string:any, spase:any) => string;
        };

        static select2(selector:JQuery, options?:Select2Options):void;
    }

    export class MicroEvent {
        constructor(object?:Object);

        bind(event:string, fct:any):void;

        unbind(event:string, fct:any):void;

        trigger(event:string, ...args:any[]):void;
    }
}


declare module "rabbitcms.datatable" {

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
    var _default: {
        groupActions: string;
        ajaxRequestGeneralError: string;
        dataTable: DataTables.LanguageSettings;
    };
    export = _default;
}
