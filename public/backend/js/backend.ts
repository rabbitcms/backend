/// <reference path="../dt/index.d.ts" />
import * as $ from "jquery";
import "jquery.cookie";
import * as i18n from "i18n!rabbitcms/nls/backend";
import {BlockUIOptions, Metronic, MetronicOptions} from "rabbitcms/metronic";

var $body:JQuery = $('body');

var _visiblePortlet = $();
var _token:string = '';

var _currentHandler:Handler;

const defaultTarget = '.page-content';


export interface RabbitCMSOptions extends MetronicOptions {
    handlers?:Handler[];
    prefix?:string;
}

export class State {
    link:string;
    handler:Handler;
    private checkers:((replay:ReplayFunc)=>Promise<void>)[] = [];
    widget:JQuery;
    hash: string;

    constructor(link:string, handler:Handler, widget:JQuery, hash:string = '') {
        this.link = link;
        this.handler = handler;
        this.widget = widget;
        this.hash = hash;
    }

    public check(replay:ReplayFunc):Promise<void[]> {
        return Promise.all<void>(this.checkers.map((a)=>a(replay)));
    }

    public addChecker(checker:(replay:ReplayFunc)=>Promise<void>) {
        this.checkers.push(checker);
    }
}

export enum StateType{
    NoPush = 0,
    None = 1,
    Push = 2,
    Replace = 3
}

export interface ReplayFunc {
    ():void;
}

class Stack {

    private _position:number = -1;
    private _previous:number = -1;
    private handleEvent:JQueryEventObject;
    private index:number = 0;
    private states: Array<State> = [];

    get current():State {
        return this.fetch(this._position);
    }

    get previous():State {
        return this.fetch(this._previous);
    }

    get position():number {
        return this._position;
    }

    constructor() {
        if (history.state && history.state.index) {
            this.index = history.state.index;
        }

        window.addEventListener('popstate', (e:PopStateEvent) => {
            this.handleEvent = null;
            if (e.state && e.state.index !== void 0) {
                this.index = history.state.index;
            }
            if (e.state && e.state.state !== void 0) {
                let index = this.index;
                this.go(e.state.state, e.state.link, ()=> {
                    history.go(index - this.index);
                });
            } else if (e.state && e.state.link) {
                RabbitCMS.navigate(e.state.link, StateType.NoPush);
            } else {
                RabbitCMS.navigate(location.pathname, StateType.NoPush);
            }
        });
    }

    public add(state:State, type:StateType = StateType.Push):number {
        this.states.length = this._position + 1;
        this._previous = this._position;
        this._position = this.states.push(state) - 1;
        switch (type) {
            case StateType.Push:
                history.pushState({state: this._position, link: state.link, index: ++this.index}, null, state.link + state.hash);
                break;
            case StateType.Replace:
                history.replaceState({state: this._position, link: state.link, index: this.index}, null, state.link + state.hash);
                break;
        }

        return this._position;
    }

    public fetch(index:number):State {
        if (index < 0) {
            return null;
        }
        if (index >= this.states.length) {
            return null
        }

        return this.states[index];
    }

    private go(index:number, link:string, replay:ReplayFunc) {
        if (index === this._position && this.current.link === link) {
            return;
        }
        let s:State = this.fetch(index);
        if (s && s.link == link) {
            let previous = this._previous;
            this._previous = this._position;
            RabbitCMS.navigateByHandler(s.handler, s.link, StateType.NoPush, replay).then((widget)=> {
                this._position = index;

                s.widget = widget;
            }, () => {
                this._previous = previous;
                if (index > this._position) {
                    history.back();
                } else {
                    history.forward();
                }
            });
        } else {
            RabbitCMS.navigate(link, StateType.Replace, replay).catch(()=> {
                if (index > this._position) {
                    history.back();
                } else {
                    history.forward();
                }
            });
        }
    }
}

export interface AjaxSettings extends JQueryAjaxSettings {
    warningTarget?:JQuery;
    blockTarget?:JQuery;
    blockOptions?:BlockUIOptions;
}

export class RabbitCMS extends Metronic {

    private static _stack:Stack = new Stack();

    private static menu:string = '';

    private static _locale:string = 'en';

    private static _handlers:Handler[] = [];

    private static prefix:string = 'admin';

    /**
     * Init RabbitCMS backend.
     */
    static init(options?:RabbitCMSOptions):void {
        options = $.extend(<RabbitCMSOptions>{
            handlers: [],
            prefix: 'admin'
        }, options);

        this.prefix = options.prefix;

        this._handlers = options.handlers.map((h:Handler) => {
            if (!(h.regex instanceof RegExp)) {
                h.regex = new RegExp('^' + h.handler);
            }
            return h;
        }).sort((a:Handler, b:Handler)=>b.regex.source.length - a.regex.source.length);

        super.init(<MetronicOptions>options);
    }

    static ready() {
        super.ready();
        $body = $('body');

        $body.on('click', '[rel="back"]', (event:JQueryEventObject) => {
            if (history.state.index > 0 && history.state !== null) {
                history.back();
            } else {
                let a:HTMLAnchorElement = <HTMLAnchorElement>event.currentTarget;
                this.navigate(a.pathname, StateType.Push);
            }
            return false;
        });

        $body.on('click', 'a[href^="#exec"]', (event:JQueryEventObject) => {
            event.preventDefault();

            let btn = $(event.currentTarget);
            let exec = btn.attr('href');
            let _tmp = exec.split(':');

            this.execute(_tmp[1], _tmp.length > 2 ? _tmp[2] : 'init', btn.data());
        });

        $body.on('click', 'a:not([href^="#"])', (event:JQueryEventObject) => {
            if ($(event.currentTarget).attr('rel') === 'back') {
                return false;
            }

            let a:HTMLAnchorElement = <HTMLAnchorElement>event.currentTarget;

            if (a.hostname != location.hostname) {
                return true;
            }

            if (this.navigate(a.pathname, StateType.Push) !== null) {
                event.preventDefault();
            }
        });

        $body.on('show.bs.tab', '.nav-tabs a[data-toggle="tab"]', (e) => {
            $(`${e.currentTarget.hash}[data-require-lazy]`).each((index, widget) => {
                let _widget = $(widget);

                this.loadModule(_widget);
                _widget.removeAttr('data-require-lazy');
            });

            let state = this._stack.current;
            state.hash = e.currentTarget.hash || '';
            history.replaceState({state: state._position, link: state.link, index: state.index}, null, state.link + state.hash);
        });

        let link = location.pathname.length > 1 ? location.pathname.replace(/\/$/, '') : location.pathname;
        let handler = this.findHandler(link);
        if (handler) {
            _currentHandler = handler;
            let widget = $('[data-require]:first', defaultTarget);
            this._stack.add(new State(link, handler, widget, location.hash), StateType.Replace);
            this.loadModuleByHandler(handler, widget, this._stack.current);
            this.showPortlet(handler, widget);
        } else {
            $('[data-require]').each((i, e)=> {
                this.loadModule($(e));
            });
        }

        $('[data-widget]').each((i, e)=> {
            this.loadModule($(e));
        });

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
        return this._handlers.find((h:Handler) => {
                return new RegExp('^' + h.handler + '$').exec(link) !== null;
            }) || null;
    }

    static setToken(value:string) {
        _token = value;
    }

    static getToken():string {
        return _token;
    }

    static getPrefix():string {
        return this.prefix;
    }

    /**
     * Set current locale.
     * @param {string} locale
     */
    static setLocale(locale:string) {
        this._locale = locale;
    }

    /**
     * Get current locale.
     * @param {Map<string,string>}map
     * @returns {string}
     */
    static getLocale(map?:Map<string,string>):string {
        return map && map.has(this._locale) ? map.get(this._locale) : this._locale;
    }

    static loadModuleByHandler(handler:Handler, widget:JQuery, state:State):void {
        if (widget.data('loaded')) {
            return;
        }

        widget.data('loaded', true);

        $('[data-require]', widget).each((i, e)=> {
            this.loadModule($(e));
        });

        if (state.hash) {
            $(`${state.hash}[data-require-lazy]`).each((index, widget) => {
                let _widget = $(widget);

                this.loadModule(_widget);
                _widget.removeAttr('data-require-lazy');
            })
        }

        this.updatePlugins(widget);

        this.execute(handler.module, handler.exec !== void 0 ? handler.exec : 'init', widget, state);
    }

    public static execute(module:string, exec:string = 'init', ...params) :Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            require([module], function (_module) {
                resolve(_module[exec](...params));
            });
        });
    }

    static loadModule(widget:JQuery) {
        if (widget.data('loaded')) {
            return;
        }

        widget.data('loaded', true);
        this.updatePlugins(widget);

        let _module = widget.data('require') || widget.data('require-lazy');

        if (_module) {
            let _tmp = _module.split(':');

            this.execute(_tmp[0], _tmp.length > 1 ? _tmp[1] : 'init', widget);
        }
    }

    static navigateByHandler(h:Handler, link:string, pushState:StateType = StateType.Push, replay:ReplayFunc):Promise<any> {
        if (!replay) {
            replay = ()=>this.navigateByHandler(h, link, pushState, replay);
        }
        return new Promise<any>((resolve, reject)=> {
            let current = this._stack.current || new State(null, null, null);
            if (h.widget instanceof jQuery) {
                if (current.widget === h.widget) {
                    resolve(h.widget);
                    return;
                }
                current.check(replay).then(()=> {
                    if (pushState !== StateType.NoPush) {
                        this._stack.add(new State(link, h, h.widget), h.pushState || pushState);
                        resolve(h.widget);
                    } else {
                        resolve(h.widget);
                    }
                    this.showPortlet(h, h.widget);
                }, ()=> {
                    reject();
                });
            } else if (link !== void 0) {
                current.check(replay).then(()=> {
                    this.ajax({
                        url: link, success: (data) => {
                            let widget = $(data);
                            let state = new State(link, h, widget);
                            this._stack.add(state, h.pushState || pushState);
                            this.loadModuleByHandler(h, widget, state);
                            this.showPortlet(h, widget);
                            resolve(widget);
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
     * @param {ReplayFunc} replay
     * @returns {Promise<boolean>}
     */
    static navigate(link:string, pushState:StateType = StateType.Push, replay?:ReplayFunc):Promise<boolean> {
        let h = this.findHandler(link);
        if (h && h.ajax !== false) {
            return this.navigateByHandler(h, link, pushState, replay);
        }
        return null;
    }

    static showPortlet(h:Handler, widget:JQuery) {
        if (h.menuPath) {
            this.setMenu(h.menuPath);
        }

        let previous = this._stack.previous;
        if (previous) {
            if (previous.handler.permanent) {
                previous.handler.widget = this._stack.previous.widget;
                previous.widget.detach();
            } else {
                previous.widget.remove();
            }
        }

        widget.appendTo(defaultTarget);

        if (location.hash) {
            widget.find(`.nav-tabs a[data-toggle="tab"][href="${location.hash}"]`).tab('show');
        }

        if (h.modal) {
            console.log(widget);
            widget.modal();
        }

        this.scrollTop();
        return true;
    }

    static loadModalWindow(link:string):Promise<JQuery> {

        return new Promise<JQuery>((resolve, reject) => {
            this.ajax({
                url: link,
                success: (data) => {
                    $('.modal').remove();
                    let modal = $(data);
                    $('.page-content').append(modal);
                    this.updatePlugins(modal);

                    modal.modal();

                    resolve(modal);
                },
                error: reject
            });
        });
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

        let html = $('<div></div>').addClass('rabbit-alert alert alert-' + options.type + ' fade in');

        if (options.close) {
            html.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>');
        }

        if (options.icon !== '') {
            html.append('<i class="fa-lg fa ' + options.icon + '"></i>  ');
        }

        html.append(options.message);

        if (options.reset) {
            $('.rabbit-alert').remove();
        }

        let _container;
        if (!options.container) {
            let tmp = this._stack.current.widget.find('.portlet-body:visible:first');

            if (tmp.hasClass('form')) {
                _container = tmp.find('.form-body').first();
            } else {
                _container = tmp;
            }
        } else {
            _container = options.container;
        }

        if (options.place == 'append') {
            _container.append(html);
        } else {
            _container.prepend(html);
        }

        if (options.focus) {
            this.scrollTo(html);
        }

        if (options.timeout > 0) {
            setTimeout(function () {
                html.remove();
            }, options.timeout * 1000);
        }
    }

    static dangerMessage(message:string, target?:JQuery) {
        let options = {container: target, type: 'danger', message: message, icon: 'fa-warning'};
        this.message(options);
    }

    static customMessage(message:string, type:string, target?:JQuery) {
        let options = {container: target, type: type, message: message};
        this.message(options);
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

        /*$body.on('click', '.page-sidebar-menu li a', function (e) {
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
        });*/

        $('.page-sidebar-menu').on('click', 'li > a.nav-toggle, li > a > span.nav-toggle', (e) => {
            var that = $(e.currentTarget).closest('.nav-item').children('.nav-link');
            var hasSubMenu = that.next().hasClass('sub-menu');

            var parent =that.parent().parent();
            var the = that;
            var menu = $('.page-sidebar-menu');
            var sub = that.next();

            var slideSpeed = parseInt(menu.data("slide-speed"));

            parent.children('li.open').children('a').children('.arrow').removeClass('open');
            parent.children('li.open').children('.sub-menu:not(.always-open)').slideUp(slideSpeed);
            parent.children('li.open').removeClass('open');

            if (sub.is(":visible")) {
                $('.arrow', the).removeClass("open");
                the.parent().removeClass("open");
                sub.slideUp(slideSpeed, () => {
                    this.handleSidebarAndContentHeight();
                });
            } else if (hasSubMenu) {
                $('.arrow', the).addClass("open");
                the.parent().addClass("open");
                sub.slideDown(slideSpeed, () => {
                    this.handleSidebarAndContentHeight();
                });
            }


            e.preventDefault();
        });
    }

    static setMenu(menu:string) {
        this.menu = menu;
        $('li[data-path]', '.page-sidebar-menu').removeClass('active open').each((i, e)=> {
            let el = $(e);
            if ((menu + '.').startsWith($(e).data('path') + '.')) {
                el.addClass('active open');
                $('.arrow', el).addClass('open');
            }
        });
    }


    /**
     * Ajax wrapper.
     * @param {JQueryAjaxSettings} options
     */
    static ajax(options:AjaxSettings):JQueryXHR {
        let originalOptions = options;

        options = $.extend(true, {
            headers:{
                'X-CSRF-TOKEN': this.getToken()
            }
        }, options);

        options.error = (jqXHR: JQueryXHR, textStatus: string, errorThrown: string): any => {
            if ($.isFunction(originalOptions.error)) {
                originalOptions.error(jqXHR, textStatus, errorThrown);
            }

            setTimeout(() => {
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
                        this.dangerMessage(jqXHR.responseJSON.message, options.warningTarget);
                        break;
                }
            }, 100);
        };

        options.complete = (jqXHR:JQueryXHR, textStatus:string):any => {
            RabbitCMS.unblockUI(options.blockTarget);

            if ($.isFunction(originalOptions.complete)) {
                originalOptions.complete(jqXHR, textStatus);
            }

            setTimeout(() => {
                switch (jqXHR.status) {
                    case 202:
                    case 418:
                        this.customMessage(jqXHR.responseJSON.message, jqXHR.responseJSON.type, options.warningTarget);
                        break;
                }
            }, 100);
        };

        this.blockUI(options.blockTarget, options.blockOptions);
        return $.ajax(options);
    }
}

export class Dialogs {
    static confirm(message:string, options?:BootboxDialogOptions, extend:boolean = true):Promise<void> {
        return new Promise<void>((resolve, reject)=> {
            require(['bootbox'], (bootbox)=> {
                bootbox.dialog($.extend(extend, <BootboxDialogOptions>{
                    message: '<h4>' + message + '</h4>',
                    closeButton: false,
                    buttons: {
                        yes: {
                            label: i18n.yes,
                            className: 'btn-sm btn-success',
                            callback: resolve
                        },
                        no: {
                            label: i18n.no,
                            className: 'btn-sm btn-danger',
                            callback: reject
                        }
                    }
                }, options));
            });
        });
    }

    static onDelete(ajax:AjaxSettings, message?:string, options?:BootboxDialogOptions):Promise<void> {
        return this.confirm(message || i18n.youWantDeleteThis, options).then(() => RabbitCMS.ajax(ajax));
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
    menuPath?:string;
    modal?:boolean;
}

export interface ValidationOptions extends JQueryValidation.ValidationOptions {
    completeSubmit?:()=>void;
}