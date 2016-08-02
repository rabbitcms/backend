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
export declare enum ResponsiveBreakpointSize {
    xs = 480,
    sm = 768,
    md = 992,
    lg = 1200,
}
export declare class BrandColors {
    static blue: string;
    static red: string;
    static green: string;
    static purple: string;
    static grey: string;
    static yellow: string;
}
export interface MetronicOptions {
    assetsPath?: string;
    rtl?: boolean;
}
export declare class Metronic {
    private static _isRTL;
    private static resizeHandlers;
    private static assetsPath;
    private static _handleOnResize();
    static init(options?: MetronicOptions): void;
    private static _handleMaterialDesign();
    static handleiCheck(target?: JQuery): void;
    static handleBootstrapSwitch(target?: JQuery): void;
    static handleSelect2(target: JQuery, options?: Select2Options): void;
    static handleScrollers(target?: JQuery): void;
    static initSlimScroll(el: JQuery): void;
    static destroySlimScroll(el: JQuery): void;
    static handleFancybox(target?: JQuery): void;
    static select2(target: JQuery, options?: Select2Options): void;
    static handlePortletTools(): void;
    static handleAlerts(): void;
    static handleDropdowns(): void;
    static handleTabDrops(target?: JQuery): void;
    private static initTabs();
    static handleTooltips(target?: JQuery): void;
    private static lastPopedPopover;
    static handlePopovers(target?: JQuery): void;
    private static initPopovers();
    static setLastPopedPopover(el: JQuery): void;
    private static initAccordions();
    private static initModals();
    static handleBootstrapConfirmation(target?: JQuery): void;
    static handleCounterup(target?: JQuery): void;
    static updatePlugins(target?: JQuery): void;
    static ready(): void;
    static addResizeHandler(func: Function): void;
    private static _runResizeHandlers();
    static runResizeHandlers(): void;
    static scrollTo(el?: JQuery, offset?: number): void;
    static scrollTop(): void;
    static blockUI(target?: JQuery | string, options?: BlockUIOptions): void;
    static unblockUI(target?: JQuery): void;
    static stopPageLoading(): void;
    static alert(options: any): string;
    static getActualVal(el: any): any;
    static getURLParameter(paramName: any): string;
    static isTouchDevice(): boolean;
    static getViewPort(): {
        width: any;
        height: any;
    };
    static getUniqueID(prefix?: string): string;
    static isRTL(): boolean;
    static getAssetsPath(): string;
    static setAssetsPath(path: string): void;
    static getBrandColor(name: string): any;
    static getResponsiveBreakpoint(size: string): any;
}
