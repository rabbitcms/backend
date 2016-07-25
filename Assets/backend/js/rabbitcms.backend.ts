/// <reference path="../../../typings/index.d.ts" />
import * as $ from "jquery";
import "jquery.cookie";

var $body:JQuery = $('body');

var _location = document.location.pathname;
var _pathname = _location.length > 1 ? _location.replace(/\/$/, '') : _location;

var _cache = {};
var _visiblePortlet = $();
var _path:string = '/';
var _token:string = '';

declare interface Handler {
    /**
     * Pathname regular expression.
     */
    handler:string;

    /**
     * Module name.
     */
        module:string;
    exec?:string;
    ajax?:boolean;
    popState?:boolean;
}

var _handlers:Handler[] = [];

export class RabbitCMS {
    /**
     * Init RabbitCMS backend.
     */
    static init() {
        $body = $('body');
        window.onpopstate = (e) => {
            var link = (e.state && e.state.link && e.state.link !== '') ? e.state.link : _pathname;

            this.navigate(link, false);

            return false;
        };

        $body.on('click', '[rel="back"]', (event) => {
            if (!this.canSubmit.check(event))
                return false;

            if (history.state !== null) {
                history.back();
            } else {
                let link = $(event.currentTarget).attr('href');
                this.navigate(link);
            }

            return false;
        });

        $body.on('click', 'a', (event:JQueryEventObject) => {
            if (!this.canSubmit.check(event)) {
                return false;
            }

            let a:HTMLAnchorElement = <HTMLAnchorElement>event.currentTarget;

            if (a.hostname != location.hostname) {
                return true;
            }

            return !this.go(a.pathname);
        });

        this.go(location.pathname, false, false);

        $('[data-require]').each((i, e)=> {
            this.loadModule($(e));
        });

        let portlet = $('.ajax-portlet:first');
        this.loadModule(portlet);
        this.cachePortlet(_pathname, portlet, false);
        this.showPortlet(portlet);


        this.uniform();
        this.initSidebar();
    }

    static go(link:string, popState:boolean = true, checkAjax:boolean = true):boolean {
        let result:boolean = false;
        _handlers.forEach((h:Handler) => {
            if (checkAjax && h.ajax === false) {
                return;
            }
            let r = new RegExp('^' + h.handler);
            if (r.exec(link)) {
                this.navigate(link, popState && h.popState !== false, h);
                result = true;
            }
        }, this);
        return result;
    }

    static setPath(value:string) {
        _path = value;
    }

    static getPath():string {
        return _path;
    }

    static setToken(value:string) {
        _token = value;
    }

    static getToken():string {
        return _token;
    };

    static loadModule(portlet:JQuery) {
        var _module = portlet.data('require');

        if (_module) {
            let _tmp = _module.split(':');
            require([_tmp[0]], function (_module) {
                if (_tmp.length === 2)
                    _module[_tmp[1]](portlet);
                else
                    _module.init(portlet);
            });
        }
    }

    static navigate(link, pushState:boolean = true, handler?:Handler) {
        link = link.length > 1 ? link.replace(/\/$/, '') : link;
        pushState = (pushState === undefined) ? true : pushState;

        if (_cache[link] !== undefined) {
            var portlet = _cache[link];

            this.cachePortlet(link, portlet, pushState);
            this.showPortlet(portlet);
        } else {
            this.ajax(link, (data) => {
                var portlet = $(data);
                this.loadModule(portlet);

                $('.page-content').append(portlet);

                this.cachePortlet(link, portlet, pushState);
                this.showPortlet(portlet);
            });
        }
    }

    static cachePortlet(link, portlet, pushState:boolean = true) {
        _cache[link] = portlet;

        if (pushState)
            history.pushState({link: link}, null, link);
    }

    static showPortlet(portlet:JQuery) {
        if (_visiblePortlet == portlet)
            return false;

        $('.ajax-portlet:visible').removeClass('show');

        if (portlet.length)
            portlet.addClass('show');
        else
            this.dangerMessage('Помилка. RabbitCMS.prototype.showPortlet');

        var _toRemove = _visiblePortlet;
        $.map(_cache, (portlet, link) => {
            if (portlet == _toRemove && portlet.data('permanent') === undefined) {
                _toRemove.remove();
                delete _cache[link];
            }
        });

        _visiblePortlet = portlet;
        this.canSubmit.init();
        this.scrollTop();
    }

    static loadModalWindow(link, callback) {
        this.ajax(link, (data) => {
            let modal = $(data);

            $('.page-content').append(modal);

            this.showModal(modal);

            if ($.isFunction(callback))
                callback(modal);
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

    static uniform(selector:JQuery = $('input[type="checkbox"]:not(.toggle, .make-switch), input[type="radio"]:not(.toggle, .star, .make-switch)')) {
        if (selector.length) {
            require(['jquery.uniform'], ()=> {
                selector.each((i:number, e:Element) => {
                    $(e).uniform();
                });
            });
        }
    }

    static getUniqueID(prefix:string = '') {
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

    static uniformUpdate(selector) {
        require(['jquery.uniform'], ()=> {
            $.uniform.update(selector);
        });
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

    static dangerMessage(message, container?) {
        var options = {container: container, type: 'danger', message: message, icon: 'fa-warning'};
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

    static setHandlers(handlers:Handler[]) {
        _handlers = handlers;
    }

    static blockUI(target?:any) {
        var imgPath = this.getPath() + '/img/loading-spinner-grey.gif';

        var html = $('<div></div>').addClass('loading-message loading-message-boxed');
        html.append('<img src="' + imgPath + '">');
        html.append('<span>&nbsp;&nbsp;' + ('Завантаження...') + '</span>');

        require(['jquery.blockui'], function () {
            if (target) {
                var el = $(target);

                el.block({
                    message: html,
                    baseZ: 1000,
                    centerY: (el.height() <= ($(window).height())),
                    css: {top: '10%', border: '0', padding: '0', backgroundColor: 'none'},
                    overlayCSS: {backgroundColor: '#000', opacity: 0.05, cursor: 'wait'}
                });
            } else {
                $.blockUI({
                    message: html,
                    baseZ: 1000,
                    css: {border: '0', padding: '0', backgroundColor: 'none'},
                    overlayCSS: {backgroundColor: '#000', opacity: 0.05, cursor: 'wait'}
                });
            }
        });
    }

    static unblockUI(target?:any) {
        require(['jquery.blockui'], function () {
            if (target) {
                $(target).unblock({
                    onUnblock: function () {
                        $(target).css({position: '', zoom: ''});
                    }
                });
            } else
                $.unblockUI();
        });
    }

    static canSubmit = {
        _match: false,
        init () {
            this.form = _visiblePortlet.find('form');
            this._match = false;

            if (this.form.length)
                this.initData = $('.form-change', this.form).serialize();
        },
        check (event) {
            if (this.form.length)
                this.saveData = $('.form-change', this.form).serialize();

            if (this._match === true || !this.form.length || (this.initData === this.saveData))
                return true;

            var form = this.form;
            var self = this;
            require(['bootbox'], function (bootbox) {
                bootbox.dialog({
                    message: '<h4>Дані було змінено. Зберегти внесені зміни?</h4>',
                    closeButton: false,
                    buttons: {
                        save: {
                            label: 'Зберегти',
                            className: 'btn-sm btn-success btn-green',
                            callback: function () {
                                form.submit();
                            }
                        },
                        cancel: {
                            label: 'Не зберігати',
                            className: 'btn-sm btn-danger',
                            callback: function () {
                                self._match = true;
                                $(event.target).trigger(event.type);
                            }
                        },
                        close: {
                            label: 'Закрити',
                            className: 'btn-sm'
                        }
                    }
                });
            });

            return false;
        }
    };

    /* all ajax methods */
    static submitForm(form, callback) {
        form = (form instanceof jQuery) ? form : $(form);
        var link = form.attr('action');
        var data = form.serialize();


        this.ajaxPost(link, data, (data) => {
            this.canSubmit._match = true;
            $('[rel="back"]:first', _visiblePortlet).trigger('click');

            if ($.isFunction(callback))
                callback(data);
        });
    }

    static ajax(link:string, callback) {
        this._ajax({url: link}, callback);
    }

    static ajaxPost(link:string, data:Object, callback) {
        this._ajax({url: link, method: 'POST', data: data}, callback);
    }

    static _ajax(options, callback) {
        options = $.extend(true, {
            success: (data) => {
                if ($.isFunction(callback))
                    callback(data);

                this.unblockUI();
            },
            error: (jqXHR) => {
                switch (jqXHR.status) {
                    case 404:
                        this.dangerMessage('Сторінку не знайдено');
                        break;
                    case 403:
                        this.dangerMessage('Доступ заборонено. Зверніться до адміністратора');
                        break;
                    case 401:
                        location.reload(true);
                        break;
                    case 503:
                        var responseText;
                        try {
                            responseText = $.parseJSON(jqXHR.responseText);
                        } catch (message) {
                            responseText = {message: message};
                        }
                        this.dangerMessage('Помилка ' + jqXHR.status + '. ' + responseText.message);
                        break;
                    default:
                        this.dangerMessage('Помилка ' + jqXHR.status + '. ' + jqXHR.statusText);
                }

                this.unblockUI();
            }
        }, options);

        this.blockUI();
        $.ajax(options);
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

    /* Tools */
    static Tools = {
        transliterate: function (string, spase) {

            spase = spase === undefined ? '-' : spase;

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

$(()=> RabbitCMS.init());

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