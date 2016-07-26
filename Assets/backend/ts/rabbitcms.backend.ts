/// <reference path="../../../typings/index.d.ts" />
import * as $ from "jquery";
import "jquery.cookie";
import * as i18n from "i18n!rabbitcms/nls/backend";

var $body:JQuery = $('body');

var _visiblePortlet = $();
var _token:string = '';

var _handlers:Handler[] = [];

var _currentWidget:JQuery;
var _currentHandler:Handler;

const defaultTarget = '.page-content';
export interface RabbitCMSOptions {
    handlers?:Handler[];
    path?:string;
}

class State {
    link:string;
    handler:Handler;
    checkers:((event?:JQueryEventObject)=>Promise<void>)[] = [];
    widget:JQuery;

    constructor(link:string, handler:Handler, widget:JQuery) {
        this.link = link;
        this.handler = handler;
        this.widget = widget;
    }

    public check(event?:JQueryEventObject):Promise<void[]> {
        return Promise.all<void>(this.checkers.map((a)=>a(event)));
    }

    public addChecker(checker:(event:JQueryEventObject)=>Promise<void>) {
        this.checkers.push(checker);
    }
}
enum StateType{
    NoPush = 0,
    None = 1,
    Push = 2,
    Replace = 3
}

interface PrevStatEventObject extends JQueryEventObject {
    index:number;
}

class Stack extends Array<State> {

    private _position:number = -1;
    private handleEvent:JQueryEventObject;
    private index:number = 0;

    get current():State {
        return this.fetch(this._position);
    }

    get position():number {
        return this._position;
    }

    constructor() {
        super();
        if (history.state && history.state.index) {
            this.index = history.state.index;
            console.log('index', this.index);
        }
        $(window).on('prevstat', (e:PrevStatEventObject)=> {
            if (this.index > e.index) {
                this.back(e, this.index - e.index);
            } else if (this.index < e.index) {
                this.back(e, e.index - this.index);
            }
        });
        window.addEventListener('popstate', (e:PopStateEvent) => {
            var event = this.handleEvent;
            this.handleEvent = null;
            if (e.state && e.state.index !== void 0) {
                this.index = history.state.index;
            }

            if (!event) {
                event = new $.Event('prevstat',{
                    currentTarget:e.srcElement,
                    index:this.index
                });
            }

            if (e.state && e.state.state !== void 0) {
                this.go(e.state.state, e.state.link, event);
            } else if (e.state && e.state.link) {
                RabbitCMS.navigate(e.state.link, StateType.NoPush, event);
            } else {
                RabbitCMS.navigate(location.pathname, StateType.NoPush, event);
            }
        });
    }

    public back(event?:JQueryEventObject, distance?:any) {
        this.handleEvent = event;
        history.back(distance);
    }

    public forward(event?:JQueryEventObject, distance?:any) {
        this.handleEvent = event;
        history.forward(distance);
    }

    public add(state:State, type:StateType = StateType.Push):number {
        this.length = this._position + 1;
        this._position = super.push(state) - 1;
        switch (type) {
            case StateType.Push:
                history.pushState({state: this._position, link: state.link, index: ++this.index}, null, state.link);
                console.log('index', this.index);
                break;
            case StateType.Replace:
                history.replaceState({state: this._position, link: state.link, index: this.index}, null, state.link);
                break;
        }

        console.log(this);

        return this._position;
    }

    public fetch(index:number):State {
        if (index < 0) {
            return null;
        }
        if (index >= this.length) {
            return null
        }

        return this[index];
    }

    private go(index:number, link:string, event:JQueryEventObject) {
        if (index === this._position && this.current.link === link) {
            return;
        }
        let s:State = this.fetch(index);
        if (s && s.link == link) {
            console.log(this._position);
            RabbitCMS.navigateByHandler(s.handler, s.link, StateType.NoPush, event).then(()=> {
                this._position = index;
            }, ()=> {
                if (index > this._position) {
                    history.back();
                } else {
                    history.forward();
                }
            });
        } else {
            RabbitCMS.navigate(link, StateType.Replace, event).then(()=> {
                //history.replaceState({state: this._position, link: this.current.link}, null, this.current.link);
            }, ()=> {
                if (index > this._position) {
                    this.back(event);
                } else {
                    this.forward(event);
                }
            });
        }
    }
}

export interface AjaxSettings extends JQueryAjaxSettings {
    warningTarget?:JQuery;
}

export class RabbitCMS {
    /**
     * Path to backend resources.
     */
    private static _path:string;

    private static _stack:Stack = new Stack();

    static get stack():Stack{
        return this._stack;
    }

    /**
     * Init RabbitCMS backend.
     */
    static init(options?:RabbitCMSOptions):void {
        options = $.extend(true, {
            handlers: [],
            path: '/'
        }, options);

        this._path = options.path;

        _handlers = options.handlers.map((h:Handler) => {
            if (!(h.regex instanceof RegExp)) {
                h.regex = new RegExp('^' + h.handler);
            }
            return h;
        }).sort((a:Handler, b:Handler)=>b.regex.source.length - a.regex.source.length);


        $(()=>this.ready());
    }

    static ready() {
        $body = $('body');


        $body.on('click', '[rel="back"]', (event:JQueryEventObject) => {
            event.stopPropagation();
            event.preventDefault();

            if (history.state !== null) {
                this._stack.back(event);
            } else {
                let a:HTMLAnchorElement = <HTMLAnchorElement>event.currentTarget;
                this.navigate(a.pathname, StateType.NoPush, event);
            }
        });

        $body.on('click', 'a', (event:JQueryEventObject) => {
            if ($(event.target).attr('rel') === 'back') {
                return false;
            }

            let a:HTMLAnchorElement = <HTMLAnchorElement>event.currentTarget;

            if (a.hostname != location.hostname) {
                return true;
            }

            return !this.navigate(a.pathname, StateType.Push, event);
        });

        let link = location.pathname.length > 1 ? location.pathname.replace(/\/$/, '') : location.pathname;
        let handler = this.findHandler(link);
        if (handler) {
            _currentHandler = handler;
            let widget = $('[data-require]:first', defaultTarget);
            this._stack.add(new State(link, handler, widget), StateType.Replace);
            this.loadModuleByHandler(handler, widget, this._stack.current);
            this.showPortlet(handler, widget);
        }

        $('[data-require]').each((i, e)=> {
            this.loadModule($(e));
        });

        this.updatePlugins();
        this.initSidebar();
    }

    /**
     * Find handler for link.
     *
     * @param {string} link
     * @returns {Handler|null}
     */
    static findHandler(link:string):Handler {
        link = link.length > 1 ? link.replace(/\/$/, '') : link;
        return _handlers.find((h:Handler) => {
                return new RegExp('^' + h.handler).exec(link) !== null;
            }) || null;
    }

    /**
     * Set backend resources path.
     *
     * @param {string} path
     */
    static setPath(path:string):void {
        this._path = path;
    }

    /**
     * Get backend resources path.
     *
     * @returns {string}
     */
    static getPath():string {
        return this._path;
    }

    static setToken(value:string) {
        _token = value;
    }

    static getToken():string {
        return _token;
    };

    static loadModuleByHandler(handler:Handler, widget:JQuery, state:State):void {
        if (widget.data('loaded')) {
            return;
        }

        widget.data('loaded', true);
        this.updatePlugins(widget);

        require([handler.module], function (_module) {
            if (handler.exec !== void 0) {
                _module[handler.exec](widget, state);
            } else {
                _module.init(widget, state);
            }
        });
    }

    static loadModule(widget:JQuery) {
        if (widget.data('loaded')) {
            return;
        }

        widget.data('loaded', true);
        this.updatePlugins(widget);

        let _module = widget.data('require');

        if (_module) {
            let _tmp = _module.split(':');
            require([_tmp[0]], function (_module) {
                if (_tmp.length === 2) {
                    _module[_tmp[1]](widget);
                } else {
                    _module.init(widget);
                }
            });
        }
    }

    static navigateByHandler(h:Handler, link:string, pushState:StateType = StateType.Push, event?:JQueryEventObject):Promise<boolean> {
        return new Promise<boolean>((resolve, reject)=> {
            let current = this._stack.current || new State(null, null, null);
            if (h.widget instanceof jQuery) {
                if (current.widget === h.widget) {
                    resolve(false);
                    return;
                }
                current.check(event).then(()=> {
                    this.showPortlet(h, h.widget);
                    if (pushState !== StateType.NoPush) {
                        this._stack.add(new State(link, h, h.widget), h.pushState || pushState);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }, ()=> {
                    reject();
                });

            } else if (link !== void 0) {
                current.check(event).then(()=> {
                    this.ajax({
                        url: link, success: (data) => {
                            let widget = $(data);
                            let state = new State(link, h, widget);
                            this.showPortlet(h, widget);
                            this.loadModuleByHandler(h, widget, state);
                            this._stack.add(state, h.pushState || pushState);
                            resolve(true);
                        }
                    });
                }, ()=> {
                    reject();
                });
            } else {
                reject();
            }
        });
    }

    /**
     * Go to link.
     * @param {string} link
     * @param {boolean} pushState
     * @param {JQueryEventObject} event
     * @returns {boolean}
     */
    static navigate(link:string, pushState:StateType = StateType.Push, event?:JQueryEventObject):Promise<boolean> {
        let h = this.findHandler(link);
        if (h && h.ajax !== false) {
            return this.navigateByHandler(h, link, pushState, event);
        }
        return new Promise<boolean>((resolve, reject)=> reject());
    }

    static showPortlet(h:Handler, widget:JQuery) {
        if (_currentWidget == widget)
            return false;
        if (_currentHandler && _currentWidget) {
            if (_currentHandler.permanent) {
                _currentHandler.widget = _currentWidget;
                _currentWidget.detach();
            } else {
                _currentWidget.remove();
            }
        }

        _currentHandler = h;
        _currentWidget = widget;

        widget.appendTo(defaultTarget);

        this.scrollTop();
        return true;
    }

    static loadModalWindow(link:string, callback:(model:JQuery, data:any, textStatus:string, jqXHR:JQueryXHR)=> any):void {
        this.ajax({
            url: link,
            success: (data, textStatus, jqXHR) => {
                let modal = $(data);
                $('.page-content').append(modal);

                if ($.isFunction(callback)) {
                    callback(modal, data, textStatus, jqXHR);
                }

                this.showModal(modal);
            }
        });
    }

    static showModal(modal:JQuery) {
        $('.ajax-modal').each((i, e:Element) => {
            var el:JQuery = $(e);

            if (el != modal && el.data('permanent') === undefined)
                el.remove();
        });

        if (modal.length)
            modal.modal();
        else
            this.dangerMessage('Помилка. RabbitCMS.prototype.showModal');
    }

    static getUniqueID(prefix:string = ''):string {
        return prefix + '_' + Math.floor(Math.random() * (new Date()).getTime());
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
            var pfmc = $('.page-fixed-main-content');
            if (pfmc.length === 1) {
                pfmc.prepend(html);
            } else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').length === 0) {
                $('.page-title').after(html);
            } else {
                var $page_bar = $('.page-bar');
                if ($page_bar.length > 0) {
                    $page_bar.after(html);
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

    static message(options) {
        options = $.extend(true, {
            container: '',
            place: 'prepend',
            type: 'success',
            message: '',
            close: true,
            reset: true,
            focus: true,
            timeout: 10,
            icon: ''
        }, options);

        var html = $('<div></div>').addClass('rabbit-alert alert alert-' + options.type + ' fade in');
        if (options.close)
            html.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>');

        if (options.icon !== '')
            html.append('<i class="fa-lg fa ' + options.icon + '"></i>  ');

        html.append(options.message);

        if (options.reset)
            $('.rabbit-alert').remove();

        var _container = (!options.container) ? _visiblePortlet.find('.portlet-body')
            : options.container;

        if (options.place == 'append')
            _container.append(html);
        else
            _container.prepend(html);

        if (options.focus)
            this.scrollTo(html);

        if (options.timeout > 0) {
            setTimeout(function () {
                html.remove();
            }, options.timeout * 1000);
        }
    }

    static dangerMessage(message:string, target?:JQuery) {
        var options = {container: target, type: 'danger', message: message, icon: 'fa-warning'};
        this.message(options);
    }

    static scrollTo(element?:JQuery, offset = -1) {
        var position = (element && element.length > 0) ? element.offset().top : 0;

        if (element) {
            if ($body.hasClass('page-header-fixed')) {
                position = position - $('.page-header').height();
            }
            position = position + offset * element.height();
        }

        $('html, body').animate({scrollTop: position}, 'slow');
    }

    static scrollTop() {
        this.scrollTo();
    }

    static getViewPort() {
        var e:Element|Window = window;
        var a = 'inner';

        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return {
            width: e[a + 'Width'],
            eight: e[a + 'Height']
        };
    }

    static updatePlugins(target?:JQuery) {
        let select2 = $('.select2', target);
        if (select2.length) {
            require(['select2'], ()=> {
                select2.select2();
            });
        }
    }

    static initSidebar() {
        if ($.cookie && $.cookie('sidebar_closed') === '1' && this.getViewPort().width >= 992) {
            $body.addClass('page-sidebar-closed');
            $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
        }

        $body.on('click', '.sidebar-toggler', function () {
            var sidebar = $('.page-sidebar');
            var sidebarMenu = $('.page-sidebar-menu');

            if ($body.hasClass('page-sidebar-closed')) {
                $body.removeClass('page-sidebar-closed');
                sidebarMenu.removeClass('page-sidebar-menu-closed');

                if ($.cookie)
                    $.cookie('sidebar_closed', '0');
            } else {
                $body.addClass('page-sidebar-closed');
                sidebarMenu.addClass('page-sidebar-menu-closed');

                if ($body.hasClass('page-sidebar-fixed'))
                    sidebarMenu.trigger('mouseleave');

                if ($.cookie)
                    $.cookie('sidebar_closed', '1');
            }

            $(window).trigger('resize');
        });

        $body.on('click', '.page-sidebar-menu > li > a', function (e) {
            var menu = $('.page-sidebar-menu');
            var subMenu = $(this).next('.sub-menu');
            var slideSpeed = parseInt(menu.data("slide-speed"));

            $('.open', menu).find('.arrow').removeClass('open');
            $('.open', menu).find('.sub-menu').slideUp(slideSpeed);
            $('.open', menu).removeClass('open');

            if (subMenu.is(":visible")) {
                $('.arrow', $(this)).removeClass('open');
                $(this).parent('li').removeClass('open');
                subMenu.slideUp(slideSpeed);
            } else {
                $('.arrow', $(this)).addClass('open');
                $(this).parent('li').addClass('open');
                subMenu.slideDown(slideSpeed);
            }

            e.preventDefault();
        });
    }

    static blockUI(target?:JQuery|string, options:BlockUIOptions = {}) {
        require(['jquery.blockui'], ()=> {
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getPath() + '/img/loading-spinner-grey.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getPath() + '/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
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

    static unblockUI(target?:any) {
        require(['jquery.blockui'], ()=> {
            if (target) {
                $(target).unblock({
                    onUnblock: ()=> {
                        $(target).css({position: '', zoom: ''});
                    }
                });
            } else
                $.unblockUI();
        });
    }

    /* all ajax methods */
    /**
     * @deprecated
     * @param form
     * @param callback
     */
    static submitForm(form, callback) {
        form = (form instanceof $) ? form : $(form);
        var link = form.attr('action');
        var data = form.serialize();


        this.ajaxPost(link, data, (data) => {
            $('[rel="back"]:first', _visiblePortlet).trigger('click');

            if ($.isFunction(callback))
                callback(data);
        });
    }

    /**
     * @deprecated
     * @param link
     * @param data
     * @param callback
     */
    static ajaxPost(link:string, data:Object, callback) {
        this.ajax({url: link, method: 'POST', data: data, success: callback});
    }

    /**
     * Ajax wrapper.
     * @param {JQueryAjaxSettings} options
     */
    static ajax(options:AjaxSettings) {
        var originalOptions = options;
        options = $.extend(true, {}, options);

        options.error = (jqXHR:JQueryXHR, textStatus:string, errorThrown:string) => {
            if ($.isFunction(originalOptions.error) && originalOptions.error(jqXHR, textStatus, errorThrown)) {
                return;
            }

            switch (jqXHR.status) {
                case 404:
                    this.dangerMessage(i18n.pageNotFound, options.warningTarget);
                    break;
                case 403:
                    this.dangerMessage(i18n.accessDenied, options.warningTarget);
                    break;
                case 401:
                    location.reload(true);
                    break;
                default:
                    let responseText;
                    try {
                        responseText = $.parseJSON(jqXHR.responseText);
                    } catch (message) {
                        responseText = {message: message};
                    }
                    this.dangerMessage('Error: ' + jqXHR.status + '. ' + responseText.message, options.warningTarget);
                    break;
            }
        };

        options.complete = (jqXHR:JQueryXHR, textStatus:string):any => {
            RabbitCMS.unblockUI();
            if ($.isFunction(originalOptions.complete)) {
                originalOptions.complete(jqXHR, textStatus);
            }
        };

        this.blockUI();
        $.ajax(options);
    }

    /**
     * @dedrecated
     * @param form
     * @param options
     */
    static validate(form:JQuery, options?:ValidationOptions):void {
        options = $.extend(true, {
            focusInvalid: true,
            highlight (element:HTMLElement) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight(element:HTMLElement) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorPlacement() {
            },
            submitHandler: (form:HTMLFormElement) => {
                this.submitForm(form, options.completeSubmit);
            },
            completeSubmit(){
            }
        }, options);

        require(['jquery.validation'], ()=> {
            form.validate(options);
        });
    }

    /* Dialogs */
    static Dialogs = {
        onDelete: function (link, callback) {
            require(['bootbox'], (bootbox)=> {
                bootbox.dialog({
                    message: '<h4>Ви впевнені, що хочете видалити цей запис?</h4>',
                    closeButton: false,
                    buttons: {
                        yes: {
                            label: 'Так',
                            className: 'btn-sm btn-success',
                            callback: function () {
                                RabbitCMS.ajaxPost(link, {}, function () {
                                    if ($.isFunction(callback))
                                        callback();
                                });
                            }
                        },
                        no: {
                            label: 'Ні',
                            className: 'btn-sm btn-danger'
                        }
                    }
                });
            });
        },
        onConfirm: function (message, callback) {
            require(['bootbox'], (bootbox)=> {
                bootbox.dialog({
                    message: '<h4>' + message + '</h4>',
                    closeButton: false,
                    buttons: {
                        yes: {
                            label: 'Так',
                            className: 'btn-sm btn-success',
                            callback: callback
                        },
                        no: {
                            label: 'Ні',
                            className: 'btn-sm btn-danger'
                        }
                    }
                });
            });
        }
    };

    static select2(selector:JQuery, options:Select2Options = {}) {
        require(['select2'], function () {
            $.fn.select2.defaults.set("theme", "bootstrap");
            options.allowClear = true;
            options.width = 'auto';
            selector.select2(options);
        });
    }
}

export class Tools {
    static transliterate(string:string, spase = '-') {
        var text = $.trim(string.toLowerCase());
        var result = '';
        var char = '';

        var matrix = {
            'й': 'i', 'ц': 'c', 'у': 'u', 'к': 'k', 'е': 'e', 'н': 'n',
            'г': 'g', 'ш': 'sh', 'щ': 'shch', 'з': 'z', 'х': 'h', 'ъ': '',
            'ф': 'f', 'ы': 'y', 'в': 'v', 'а': 'a', 'п': 'p', 'р': 'r',
            'о': 'o', 'л': 'l', 'д': 'd', 'ж': 'zh', 'э': 'e', 'ё': 'e',
            'я': 'ya', 'ч': 'ch', 'с': 's', 'м': 'm', 'и': 'i', 'т': 't',
            'ь': '', 'б': 'b', 'ю': 'yu', 'ү': 'u', 'қ': 'k', 'ғ': 'g',
            'ә': 'e', 'ң': 'n', 'ұ': 'u', 'ө': 'o', 'Һ': 'h', 'һ': 'h',
            'і': 'i', 'ї': 'ji', 'є': 'je', 'ґ': 'g',
            ' ': spase, '_': spase, '`': '', '~': '', '!': '', '@': '',
            '#': '', '$': '', '%': '', '^': '', '&': '', '*': '',
            '(': '', ')': '', '-': spase, '=': '', '+': '', '[': '',
            ']': '', '\\': '', '|': '', '/': '', '.': '', ',': '',
            '{': '', '}': '', '\'': '', '"': '', ';': '', ':': '',
            '?': '', '<': '', '>': '', '№': ''
        };

        for (var i = 0; i < text.length; i++) {
            if (matrix[text[i]] != undefined) {
                if (char != matrix[text[i]] || char != spase) {
                    result += matrix[text[i]];
                    char = matrix[text[i]];
                }
            } else {
                result += text[i];
                char = text[i];
            }
        }

        return $.trim(result);
    }
}

export interface FormOptions {
    validation?:ValidationOptions;
    ajax?:AjaxSettings|boolean;
    completeSubmit:()=>void;
    state?:State;
    dialog?:BootboxDialogOptions|boolean
}

export class Form {
    private options:FormOptions;
    private form:JQuery;
    private data:string;
    private match:boolean = false;

    constructor(form:JQuery, options?:FormOptions) {
        this.form = form;
        this.options = $.extend(true, {
            validate: null,
            completeSubmit: ()=> {
            }
        }, options);

        if (this.options.state && this.options.dialog !== false) {
            this.options.state.addChecker((event:JQueryEventObject)=>new Promise<void>((resolve, reject)=> {
                if (!this.match && this.data !== this.getData()) {
                    require(['bootbox'], (bootbox:BootboxStatic)=> {
                        let dialog:BootboxDialogOptions = <BootboxDialogOptions>$.extend(true, <BootboxDialogOptions>{
                            message: '<h4>Дані було змінено. Зберегти внесені зміни?</h4>',
                            closeButton: false,
                            buttons: {
                                save: {
                                    label: 'Зберегти',
                                    className: 'btn-sm btn-success btn-green',
                                    callback: ()=> {
                                        this.form.submit();
                                    }
                                },
                                cancel: {
                                    label: 'Не зберігати',
                                    className: 'btn-sm btn-danger',
                                    callback: () => {
                                        this.match = true;
                                        console.log(event);
                                        $(event.currentTarget).trigger(event);
                                    }
                                },
                                close: {
                                    label: 'Закрити',
                                    className: 'btn-sm'
                                }
                            }
                        }, this.options.dialog);
                        bootbox.dialog(dialog);
                    });
                    reject();
                    console.log('1.reject');
                } else {
                    this.match = false;
                    resolve();
                    console.log('1.resolve');
                }
            }));
        }

        if (this.options.validation !== false) {
            require(['jquery.validation'], ()=> {
                let options = $.extend(true, {
                    focusInvalid: true,
                    highlight (element:HTMLElement) {
                        $(element).closest('.form-group').addClass('has-error');
                    },
                    unhighlight(element:HTMLElement) {
                        $(element).closest('.form-group').removeClass('has-error');
                    },
                    errorPlacement() {
                    },
                    submitHandler: () => {
                        this.submitForm();
                    }
                }, this.options.validation);
                form.validate(options);
            });
        } else {
            form.on('submit', ()=> {
                this.submitForm();
            });
        }
        this.syncOriginal();
    }

    syncOriginal() {
        this.data = this.getData();
    }

    getData():string {
        return $('input:not(.ignore-scan),select:not(.ignore-scan),textarea:not(.ignore-scan)', this.form).serialize();
    }

    submitForm() {
        this.syncOriginal();
        if (this.options.ajax !== false) {
            RabbitCMS.ajax({
                url: this.form.attr('action'),
                method: this.form.attr('method'),
                data: this.data,
                success: ()=> {
                    if(!this.options.completeSubmit()){
                        RabbitCMS.stack.back()
                    }
                }
            });
        } else {
            (<HTMLFormElement>this.form[0]).submit();
            this.options.completeSubmit();
        }
    }
}

/* --- --- --- */

export class MicroEvent {
    private _events = {};

    constructor(object?:Object) {
        if (object !== void 0) {
            Object.keys(object).forEach((key) => {
                this[key] = object[key];
            }, this);
        }
    }

    bind(event:string, fct) {
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fct);
    }

    unbind(event:string, fct) {
        this._events = this._events || {};
        if (event in this._events === false)    return;
        this._events[event].splice(this._events[event].indexOf(fct), 1);
    }

    trigger(event:string, ...args:any[]) {
        this._events = this._events || {};
        if (event in this._events === false) return;
        for (var i = 0, l = this._events[event].length; i < l; i++) {
            this._events[event][i].apply(this, args);
        }
    }
}

export interface Handler {
    /**
     * Pathname regular expression.
     */
    handler:string;
    regex?:RegExp;
    module:string;
    exec?:string;
    ajax?:boolean;
    pushState?:StateType;
    permanent?:boolean;
    widget?:JQuery;
}

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

export interface ValidationOptions extends JQueryValidation.ValidationOptions {
    completeSubmit?:()=>void;
}