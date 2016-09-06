/// <reference path="../../dt/index.d.ts" />

/**
 * Created by lnkvisitor on 30.07.16.
 */
import * as $ from "jquery";

export interface BlockUIOptions {
    message?:string;
    boxed?:boolean;
    animate?:boolean;
    iconOnly?:boolean;
    textOnly?:boolean;
    target?:JQuery|string;
    zIndex?:number;
    cenrerY?:boolean;
    overlayColor?:string;
}

export enum ResponsiveBreakpointSize{
    xs = 480,
    sm = 768,
    md = 992,
    lg = 1200
}

export class BrandColors {
    static blue = '#89C4F4';
    static red = '#F3565D';
    static green = '#1bbc9b';
    static purple = '#9b59b6';
    static grey = '#95a5a6';
    static yellow = '#F8CB00';
}

export interface MetronicOptions {
    assetsPath?:string;
    rtl?:boolean;
}

export class Metronic {
    private static _isRTL:boolean = false;

    private static resizeHandlers:Function[] = [];

    private static assetsPath = '../assets/';

    private static _handleOnResize() {
        var resize;

        $(window).on('resize', ()=> {
            if (resize) {
                clearTimeout(resize);
            }
            resize = setTimeout(() => {
                this._runResizeHandlers();
            }, 50); // wait 50ms until window resize finishes.
        });
    }

    static init(options?:MetronicOptions) {
        options = $.extend(<MetronicOptions>{
            assetsPath:'../assets/'
        }, options);

        this.assetsPath = options.assetsPath;

        this._isRTL = options.hasOwnProperty('rtl') ? options.rtl : $('body').css('direction') === 'rtl';

        $(()=>this.ready());
    }

    private static _handleMaterialDesign() {
        let $body = $('body');
        // Material design ckeckbox and radio effects
        $body.on('click', '.md-checkbox > label, .md-radio > label', function () {
            var the = $(this);
            // find the first span which is our circle/bubble
            var el = $(this).children('span:first-child');

            // add the bubble class (we do this so it doesnt show on page load)
            el.addClass('inc');

            // clone it
            var newone = el.clone(true);

            // add the cloned version before our original
            el.before(newone);

            // remove the original so that it is ready to run on next click
            $("." + el.attr("class") + ":last", the).remove();
        });

        if ($body.hasClass('page-md')) {
            // Material design click effect
            // credit where credit's due; http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design
            var element, circle, d, x, y;
            $body.on('click', 'a.btn, button.btn, input.btn, label.btn',  (e:JQueryMouseEventObject) =>{
                element = $(e.currentTarget);

                if (element.find(".md-click-circle").length == 0) {
                    element.prepend("<span class='md-click-circle'></span>");
                }

                circle = element.find(".md-click-circle");
                circle.removeClass("md-click-animate");

                if (!circle.height() && !circle.width()) {
                    d = Math.max(element.outerWidth(), element.outerHeight());
                    circle.css({height: d, width: d});
                }

                x = e.pageX - element.offset().left - circle.width() / 2;
                y = e.pageY - element.offset().top - circle.height() / 2;

                circle.css({top: y + 'px', left: x + 'px'}).addClass("md-click-animate");

                setTimeout(() => {
                    circle.remove();
                }, 1000);
            });
        }

        // Floating labels
        var handleInput = function (el) {
            if (el.val() != "") {
                el.addClass('edited');
            } else {
                el.removeClass('edited');
            }
        };

        $body.on('keydown', '.form-md-floating-label .form-control', function () {
            handleInput($(this));
        });
        $body.on('blur', '.form-md-floating-label .form-control', function () {
            handleInput($(this));
        });

        $('.form-md-floating-label .form-control').each(function () {
            if ($(this).val().length > 0) {
                $(this).addClass('edited');
            }
        });
    }

    static handleBootstrapSwitch(target?:JQuery) {
        let bSwitch = $('.make-switch', target);
        if (bSwitch.length > 0) {
            require(['rabbitcms/loader/bootstrap-switch'], ()=> {
                bSwitch.bootstrapSwitch();
            });
        }
    }

    static handleSelect2(target:JQuery, options:Select2Options = {}) {
        let select2 = $('.select2me', target);
        if (select2.length > 0) {
            require(['rabbitcms/loader/jquery.select2'], ()=> {
                $('.select2me', target).select2(options);
            });
        }
    }

    static handleScrollers(target?:JQuery) {
        this.initSlimScroll($('.scroller', target));
    }

    static initSlimScroll(el:JQuery) {
        require(['slimScroll'], ()=> {
            el.each((index, elem) => {
                let $elem = $(elem);
                if ($elem.attr("data-initialized")) {
                    return; // exit
                }

                var height;

                if ($elem.attr("data-height")) {
                    height = $elem.attr("data-height");
                } else {
                    height = $elem.css('height');
                }

                $elem.slimScroll({
                    allowPageScroll: true, // allow page scroll when the element scroll is ended
                    size: '7px',
                    color: ($elem.attr("data-handle-color") ? $elem.attr("data-handle-color") : '#bbb'),
                    wrapperClass: ($elem.attr("data-wrapper-class") ? $elem.attr("data-wrapper-class") : 'slimScrollDiv'),
                    railColor: ($elem.attr("data-rail-color") ? $elem.attr("data-rail-color") : '#eaeaea'),
                    position: this.isRTL() ? 'left' : 'right',
                    height: height,
                    alwaysVisible: ($elem.attr("data-always-visible") == "1" ? true : false),
                    railVisible: ($elem.attr("data-rail-visible") == "1" ? true : false),
                    disableFadeOut: true
                });

                $elem.attr("data-initialized", "1");
            });
        });
    }

    static destroySlimScroll(el:JQuery) {
        require(['slimScroll'], ()=> {
            el.each((index, elem) => {
                let $elem = $(elem);

                if ($elem.attr("data-initialized") === "1") { // destroy existing instance before updating the height
                    $elem.removeAttr("data-initialized");
                    $elem.removeAttr("style");

                    var attrList = {};

                    // store the custom attribures so later we will reassign.
                    if ($elem.attr("data-handle-color")) {
                        attrList["data-handle-color"] = $elem.attr("data-handle-color");
                    }
                    if ($elem.attr("data-wrapper-class")) {
                        attrList["data-wrapper-class"] = $elem.attr("data-wrapper-class");
                    }
                    if ($elem.attr("data-rail-color")) {
                        attrList["data-rail-color"] = $elem.attr("data-rail-color");
                    }
                    if ($elem.attr("data-always-visible")) {
                        attrList["data-always-visible"] = $elem.attr("data-always-visible");
                    }
                    if ($elem.attr("data-rail-visible")) {
                        attrList["data-rail-visible"] = $elem.attr("data-rail-visible");
                    }

                    $elem.slimScroll({
                        wrapperClass: ($elem.attr("data-wrapper-class") ? $elem.attr("data-wrapper-class") : 'slimScrollDiv'),
                        destroy: true
                    });


                    // reassign custom attributes
                    $.each(attrList, function (key, value) {
                        $elem.attr(key, value);
                    });

                }
            });
        });
    }

    static handleFancybox(target?:JQuery) {
        let fancybox = $(".fancybox-button", target);
        if (fancybox.length > 0) {
            require(['jquery.fancybox'], ()=> {
                fancybox.fancybox({
                    prevEffect: 'none',
                    nextEffect: 'none',
                    closeBtn: true,
                    helpers: {
                        title: {
                            type: 'inside'
                        }
                    }
                });
            });
        }
    }

    static select2(target:JQuery, options:Select2Options = {}) :Promise<JQuery> {
        return new Promise<JQuery>((resolve) => {
            require(['rabbitcms/loader/jquery.select2'], (promise: Promise<void>) => {
                promise.then(() => {
                    resolve(target.select2(options));
                });
            });
        });
    }

    static datePicker(target:JQuery, options:DatepickerOptions = {}) :Promise<JQuery> {
        return new Promise<JQuery>((resolve) => {
            require(['rabbitcms/loader/bootstrap-datepicker'], (promise: Promise<void>) => {
                promise.then(() => {
                    resolve(target.datepicker(options));
                });
            });
        });
    }

    static colorBox(options: ColorboxSettings = {}) {
        require(['rabbitcms/loader/jquery.colorbox'], () => {
            $.colorbox(options);
        });
    }

    static maskMoney(target: JQuery, options: any) { //TODO: DT for maskMoney
        require(['jquery.maskMoney'], () => {
            target.maskMoney(options);
        });
    }

    static handlePortletTools() {
        let $body = $('body');
        // handle portlet remove
        $body.on('click', '.portlet > .portlet-title > .tools > a.remove', (e:JQueryEventObject) => {
            e.preventDefault();
            let portlet = $(e.currentTarget).closest(".portlet");

            if ($body.hasClass('page-portlet-fullscreen')) {
                $body.removeClass('page-portlet-fullscreen');
            }

            portlet.find('.portlet-title .fullscreen').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .reload').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .remove').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .config').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip('destroy');

            portlet.remove();
        });

        // handle portlet fullscreen
        $body.on('click', '.portlet > .portlet-title .fullscreen', (e:JQueryEventObject)=> {
            let $elem = $(e.currentTarget);
            e.preventDefault();
            var portlet = $elem.closest(".portlet");
            if (portlet.hasClass('portlet-fullscreen')) {
                $elem.removeClass('on');
                portlet.removeClass('portlet-fullscreen');
                $body.removeClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', 'auto');
            } else {
                var height = this.getViewPort().height -
                    portlet.children('.portlet-title').outerHeight() -
                    parseInt(portlet.children('.portlet-body').css('padding-top')) -
                    parseInt(portlet.children('.portlet-body').css('padding-bottom'));

                $elem.addClass('on');
                portlet.addClass('portlet-fullscreen');
                $body.addClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', height);
            }
        });

        // load ajax data on page init
        $('.portlet .portlet-title a.reload[data-load="true"]').click();

        $body.on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            if ($(this).hasClass("collapse")) {
                $(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            } else {
                $(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    }

    static handleAlerts() {
        let $body = $('body');
        $body.on('click', '[data-close="alert"]', function (e) {
            $(this).parent('.alert').hide();
            $(this).closest('.note').hide();
            e.preventDefault();
        });

        $body.on('click', '[data-close="note"]', function (e) {
            $(this).closest('.note').hide();
            e.preventDefault();
        });

        $body.on('click', '[data-remove="note"]', function (e) {
            $(this).closest('.note').remove();
            e.preventDefault();
        });
    }

    static handleDropdowns() {
        /*
         Hold dropdown on click
         */
        $('body').on('click', '.dropdown-menu.hold-on-click', function (e) {
            e.stopPropagation();
        });
    }

    static handleTabDrops(target?:JQuery) {
        let elms = $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs', target);
        if (elms.length > 0) {
            require(['rabbitcms/loader/bootstrap-tabdrop'], ()=> {
                elms.tabdrop({
                    text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
                });
            });
        }
    }

    private static initTabs() {
        //activate tab if tab id provided in the URL
        let hash = encodeURI(location.hash);
        if (hash) {
            hash.substr(1).split(',').forEach((tabid)=> {
                let tab = $('a[href="#' + tabid + '"]');
                tab.parents('.tab-pane:hidden').each((index, elem)=> {
                    var tabid = $(elem).attr("id");
                    $('a[href="#' + tabid + '"]').click();
                });
                tab.click();
            });
        }
    };

    static handleTooltips(target?:JQuery) {
        // global tooltips
        $('.tooltips', target).tooltip();

        // portlet tooltips
        $('.portlet > .portlet-title .fullscreen', target).tooltip({
            trigger: 'hover',
            container: 'body',
            title: 'Fullscreen'
        });
        $('.portlet > .portlet-title > .tools > .reload', target).tooltip({
            trigger: 'hover',
            container: 'body',
            title: 'Reload'
        });
        $('.portlet > .portlet-title > .tools > .remove', target).tooltip({
            trigger: 'hover',
            container: 'body',
            title: 'Remove'
        });
        $('.portlet > .portlet-title > .tools > .config', target).tooltip({
            trigger: 'hover',
            container: 'body',
            title: 'Settings'
        });
        $('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand', target).tooltip({
            trigger: 'hover',
            container: 'body',
            title: 'Collapse/Expand'
        });
    }

    private static lastPopedPopover:JQuery;

    static handlePopovers(target?:JQuery) {
        $('.popovers', target).popover();
    }

    private static initPopovers() {
        $(document).on('click.bs.popover.data-api', () => {
            if (this.lastPopedPopover) {
                this.lastPopedPopover.popover('hide');
            }
        });
    }

    static setLastPopedPopover(el:JQuery) {
        this.lastPopedPopover = el;
    }

    private static initAccordions() {
        $('body').on('shown.bs.collapse', '.accordion.scrollable', (e:JQueryEventObject)=> {
            this.scrollTo($(e.target));
        });
    }

    private static  initModals() {
        let $body = $('body');
        // fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class.
        $body.on('hide.bs.modal', function () {
            $('html').toggleClass('modal-open',$('.modal:visible').length > 1);
        });

        // fix page scrollbars issue
        $body.on('show.bs.modal', '.modal', function () {
            if ($(this).hasClass("modal-scroll")) {
                $('body').addClass("modal-open-noscroll");
            }
        });

        // fix page scrollbars issue
        $body.on('hidden.bs.modal', '.modal', function () {
            $body.removeClass("modal-open-noscroll");
        });

        // remove ajax content and remove cache on modal closed
        $body.on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
            $(this).removeData('bs.modal');
        });
    }

// Handles Bootstrap confirmations
    static handleBootstrapConfirmation(target?:JQuery) {
        let elms = $('[data-toggle=confirmation]',target);
        if (elms.length > 0) {
            require(['bootstrap-confirmation.d'], ()=> {
                elms.confirmation({
                    btnOkClass: 'btn btn-sm btn-success',
                    btnCancelClass: 'btn btn-sm btn-danger'
                });
            });
        }
    }

    static handleCounterup(target?:JQuery) {
        let elms = $("[data-counter='counterup']", target);
        if (elms.length > 0) {
            require(['rabbitcms/loader/counterup'], ()=> {
                elms.counterUp({
                    delay: 10,
                    time: 1000
                });
            });
        }
    }

    static updatePlugins(target?:JQuery) {
        this.handleBootstrapSwitch(target);
        this.handleScrollers(target);
        this.handleSelect2(target);
        this.handleFancybox(target);
        this.handleTabDrops(target);
        this.handleTooltips(target);
        this.handlePopovers(target);
        this.handleBootstrapConfirmation(target);
        this.handleCounterup(target);
    }

    //main function to initiate the theme
    static ready() {

        //Core handlers
        this._handleOnResize(); // set and handle responsive

        //UI Component handlers
        this._handleMaterialDesign(); // handle material desi
        this.updatePlugins();
        this.handlePortletTools();
        this.handleAlerts();
        this.handleDropdowns();
        this.initTabs();
        this.initPopovers();
        this.initAccordions();
        this.initModals();


        //Handle group element heights
        this.addResizeHandler(()=> {
            $('[data-auto-height]').each(function (index, elem) {
                var parent = $(elem);
                var items = $('[data-height]', parent);
                var height = 0;
                var mode = parent.attr('data-mode');
                var offset = parseInt(parent.attr('data-offset')) || 0;

                items.each((index, elem) => {
                    let $elem = $(elem);
                    if ($elem.attr('data-height') == "height") {
                        $elem.css('height', '');
                    } else {
                        $elem.css('min-height', '');
                    }

                    var height_ = (mode == 'base-height' ? $elem.outerHeight() : $elem.outerHeight(true));
                    if (height_ > height) {
                        height = height_;
                    }
                });

                height = height + offset;

                items.each((index, elem) => {
                    let $elem = $(elem);
                    if ($elem.attr('data-height') == "height") {
                        $elem.css('height', height);
                    } else {
                        $elem.css('min-height', height);
                    }
                });

                if (parent.attr('data-related')) {
                    $(parent.attr('data-related')).css('height', parent.height());
                }
            });
        }); // handle auto calculating height on window resize
    }

    //public function to add callback a function which will be called on window resize
    static addResizeHandler(func:Function) {
        this.resizeHandlers.push(func);
    }

    // runs callback functions set by App.addResponsiveHandler().
    private static _runResizeHandlers() {
        // reinitialize other subscribed elements
        this.resizeHandlers.forEach((handler:Function)=>handler());
    }

    //public functon to call _runresizeHandlers
    static runResizeHandlers() {
        this._runResizeHandlers();
    }

    // wrApper function to scroll(focus) to an element
    static scrollTo(el?:JQuery, offset = 0) {
        var pos = (el && el.length > 0) ? el.offset().top : 0;
        let $body = $('body');
        if (el) {
            if ($body.hasClass('page-header-fixed')) {
                pos = pos - $('.page-header').height();
            } else if ($body.hasClass('page-header-top-fixed')) {
                pos = pos - $('.page-header-top').height();
            } else if ($body.hasClass('page-header-menu-fixed')) {
                pos = pos - $('.page-header-menu').height();
            }
            pos = pos + (offset ? offset : -1 * el.height());
        }

        $('html,body').animate({
            scrollTop: pos
        }, 'slow');
    }


    // function to scroll to the top
    static scrollTop() {
        this.scrollTo();
    }

    static blockUI(target?:JQuery|string, options:BlockUIOptions = {}) {
        require(['jquery.blockui'], ()=> {
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getAssetsPath() + '/img/loading-spinner-grey.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getAssetsPath() + '/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }

            if (target) { // element blocking
                var el = $(target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        });
    }

    static unblockUI(target?:JQuery) {
        require(['jquery.blockui'], ()=> {
            if (target) {
                target.unblock({
                    onUnblock: ()=> {
                        target.css({position: '', zoom: ''});
                    }
                });
            } else
                $.unblockUI();
        });
    }

    static stopPageLoading() {
        $('.page-loading, .page-spinner-bar').remove();
    }

    static alert(options) {

        options = $.extend(true, {
            container: "", // alerts parent container(by default placed after the page breadcrumbs)
            place: "append", // "append" or "prepend" in container
            type: 'success', // alert's type
            message: "", // alert's message
            close: true, // make alert closable
            reset: true, // close all previouse alerts first
            focus: true, // auto scroll to the alert after shown
            closeInSeconds: 0, // auto close after defined seconds
            icon: "" // put icon before the message
        }, options);

        var id = this.getUniqueID("App_alert");

        var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

        if (options.reset) {
            $('.custom-alerts').remove();
        }

        if (!options.container) {
            let elm = $('.page-fixed-main-content');
            if (elm.length === 1) {
                elm.prepend(html);
            } else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').length === 0) {
                $('.page-title').after(html);
            } else {
                let bar = $('.page-bar');
                if (bar.length > 0) {
                    bar.after(html);
                } else {
                    $('.page-breadcrumb, .breadcrumbs').after(html);
                }
            }
        } else {
            if (options.place == "append") {
                $(options.container).append(html);
            } else {
                $(options.container).prepend(html);
            }
        }

        if (options.focus) {
            this.scrollTo($('#' + id));
        }

        if (options.closeInSeconds > 0) {
            setTimeout(function () {
                $('#' + id).remove();
            }, options.closeInSeconds * 1000);
        }

        return id;
    }

    //public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
    static getActualVal(el) {
        el = $(el);
        if (el.val() === el.attr("placeholder")) {
            return "";
        }
        return el.val();
    }

    static getURLParameter(paramName) {
        var searchString = window.location.search.substring(1),
            i, val, params = searchString.split("&");

        for (i = 0; i < params.length; i++) {
            val = params[i].split("=");
            if (val[0] == paramName) {
                return decodeURIComponent(val[1]);
            }
        }
        return null;
    }

    // check for device touch support
    static isTouchDevice() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }

    // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
    static getViewPort() {
        var e:Window|HTMLElement = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    }

    static getUniqueID(prefix:string = '') {
        return prefix + '_' + Math.floor(Math.random() * (new Date()).getTime());
    }

    //check RTL mode
    static isRTL() {
        return this._isRTL;
    }

    static getAssetsPath():string {
        return this.assetsPath;
    }

    static setAssetsPath(path:string) {
        this.assetsPath = path;
    }

    // get layout color code by color name
    static getBrandColor(name:string) {
        return name in BrandColors ? BrandColors[name] : '';
    }

    static getResponsiveBreakpoint(size:string) {
        return size in ResponsiveBreakpointSize ? ResponsiveBreakpointSize[size] : 0;
    }
}



// function A() {
//
//
//     var handleDropdownHover = function () {
//         $('[data-hover="dropdown"]').not('.hover-initialized').each(function () {
//             $(this).dropdownHover();
//             $(this).addClass('hover-initialized');
//         });
//     };
// }
// Handles Bootstrap Popovers