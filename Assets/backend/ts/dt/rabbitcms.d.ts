declare module 'rabbitcms/metronic' {
    export interface BlockUIOptions {
        message?: string;
        boxed?: boolean;
        animate?: boolean;
        iconOnly?: boolean;
        textOnly?: boolean;
        target?: JQuery|string;
        zIndex?: number;
        cenrerY?: boolean;
        overlayColor?: string;
    }

    export interface MetronicOptions {
        assetsPath?: string;
        rtl?: boolean;
    }

    export class Metronic {
        static init(options?: MetronicOptions);

        static handleiCheck(target?: JQuery);

        static handleBootstrapSwitch(target?: JQuery)

        static handleSelect2(target: JQuery, options: Select2Options);

        static handleScrollers(target?: JQuery)

        static initSlimScroll(el: JQuery);

        static destroySlimScroll(el: JQuery)

        static handleFancybox(target?: JQuery)

        static select2(target: JQuery, options: Select2Options)

        static handlePortletTools()

        static handleAlerts()

        static handleDropdowns()

        static handleTabDrops(target?: JQuery)

        static handleTooltips(target?: JQuery)

        static handlePopovers(target?: JQuery)

        static handleBootstrapConfirmation(target?: JQuery)

        static handleCounterup(target?: JQuery);

        static updatePlugins(target?: JQuery);

        //main function to initiate the theme
        static ready()

        //public function to add callback a function which will be called on window resize
        static addResizeHandler(func: Function)

        //public functon to call _runresizeHandlers
        static runResizeHandlers()

        // wrApper function to scroll(focus) to an element
        static scrollTo(el?: JQuery, offset?: number);

        // function to scroll to the top
        static scrollTop()

        static blockUI(target?: JQuery|string, options?: BlockUIOptions);

        static unblockUI(target?: JQuery)

        static stopPageLoading()

        static alert(options);

        //public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
        static getActualVal(el)

        static getURLParameter(paramName);

        // check for device touch support
        static isTouchDevice()

        // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        static getViewPort();

        static getUniqueID(prefix?: string);

        //check RTL mode
        static isRTL()

        static getAssetsPath(): string;

        static setAssetsPath(path: string);

        // get layout color code by color name
        static getBrandColor(name: string);

        static getResponsiveBreakpoint(size: string);
    }
}

declare module 'rabbitcms/backend' {
    import {Metronic, BlockUIOptions, MetronicOptions} from "rabbitcms/metronic";

    export enum StateType{
        NoPush = 0,
        None = 1,
        Push = 2,
        Replace = 3
    }

    export interface ReplayFunc {
        (): void;
    }

    export interface Handler {
        /**
         * Pathname regular expression.
         */
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

    export interface RabbitCMSOptions extends MetronicOptions {
        handlers?: Handler[];
    }

    export class State {
        link: string;
        handler: Handler;
        widget: JQuery;

        constructor(link: string, handler: Handler, widget: JQuery);

        public check(replay: ReplayFunc): Promise<void[]>;

        public addChecker(checker: (replay: ReplayFunc)=>Promise<void>);
    }

    export interface AjaxSettings extends JQueryAjaxSettings {
        warningTarget?: JQuery;
        blockTarget?: JQuery;
        blockOptions?: BlockUIOptions;
    }

    export class RabbitCMS extends Metronic {
        /**
         * Init RabbitCMS backend.
         */
        static init(options?: RabbitCMSOptions): void;

        static ready(): void;

        /**
         * Find handler for link.
         *
         * @param {string} link
         * @returns {Handler|null}
         */
        static findHandler(link: string): Handler;

        static setToken(value: string);

        static getToken(): string;

        /**
         * Set current locale.
         * @param {string} locale
         */
        static setLocale(locale: string);

        /**
         * Get current locale.
         * @param {Map<string,string>}map
         * @returns {string}
         */
        static getLocale(map?: Map<string,string>): string;

        static loadModule(widget: JQuery);

        static navigateByHandler(h: Handler, link: string, pushState?: StateType, replay?: ReplayFunc): Promise<boolean>;

        /**
         * Go to link.
         * @param {string} link
         * @param {boolean} pushState
         * @param {ReplayFunc} replay
         * @returns {Promise<boolean>}
         */
        static navigate(link: string, pushState?: StateType, replay?: ReplayFunc): Promise<boolean>;

        static showPortlet(h: Handler, widget: JQuery);

        static loadModalWindow(link: string, callback: (model: JQuery, data: any, textStatus: string, jqXHR: JQueryXHR)=> any): void;

        static showModal(modal: JQuery);

        static getUniqueID(prefix?: string): string;

        static alert(options);

        static message(options);

        static dangerMessage(message: string, target?: JQuery);

        static initSidebar();

        static setMenu(menu: string);

        /**
         * Ajax wrapper.
         * @param {JQueryAjaxSettings} options
         */
        static ajax(options: AjaxSettings): JQueryXHR;
    }

    export class Dialogs {
        static confirm(message: string, options?: BootboxDialogOptions): Promise<void>;

        static onDelete(ajax: AjaxSettings, message?: string, options?: BootboxDialogOptions): Promise<void>;
    }

    export class Tools {
        static transliterate(string: string, space?: string);
    }


    /* --- --- --- */

    export class MicroEvent {

        constructor(object?: Object);

        bind(event: string, fct: Function): void;

        unbind(event: string, fct: Function): void;

        trigger(event: string, ...args: any[]): void;
    }

    export interface ValidationOptions extends JQueryValidation.ValidationOptions {
        completeSubmit?: ()=>void;
    }
}

declare module 'rabbitcms/datatable' {
    export interface DataTableResponseData {
        raw: number;
        recordsFiltered: number;
        recordsTotal: number;
        customActionMessage?: string;
        customActionStatus?: string;
        data: any[];
    }

    export interface DataTableOptions {
        dataTable?: DataTables.Settings;
        src?: string|JQuery;
        loadingMessage?: string;
        resetGroupActionInputOnSuccess?: boolean;
        filterApplyAction?: string;
        filterCancelAction?: string;
        onDataLoad?: (dataTable: DataTable) => void;
        onError?: (dataTable: DataTable) => void;
        onSuccess?: (dataTable: DataTable, response: DataTableResponseData) => void;
    }

    /***
     Wrapper/Helper Class for datagrid based on jQuery Datatable Plugin
     ***/
    export class DataTable {
        //main function to initiate the module
        constructor(options: DataTableOptions);

        submitFilter(): void;

        resetFilter(): void;

        getSelectedRowsCount(): number;

        getSelectedRows(): any[];

        setAjaxParam(name: string, value: any): void;

        addAjaxParam(name: string, value: any): void;

        clearAjaxParams(): void;

        getDataTable(): DataTables.DataTable;

        getTableWrapper(): JQuery;

        getTableContainer(): JQuery;

        getTable(): JQuery;
    }
}

declare module 'rabbitcms/form' {
    import {RabbitCMS, State, ValidationOptions} from "rabbitcms/backend";

    export interface FormOptions {
        validation?: ValidationOptions;
        ajax?: DataTables.AjaxSettings|boolean;
        completeSubmit: ()=>void;
        state?: State;
        dialog?: BootboxDialogOptions|boolean
    }

    export class Form {
        constructor(form: JQuery, options?: FormOptions);

        syncOriginal(): void;

        getData(): string;

        submitForm(): void;
    }
}