define(["require", "exports", "jquery", "jquery.cookie"], function (require, exports, $) {
    "use strict";
    var $body = $('body');
    var _location = document.location.pathname;
    var _pathname = _location.length > 1 ? _location.replace(/\/$/, '') : _location;
    var _visiblePortlet = $();
    var _path = '/';
    var _token = '';
    var _handlers = [];
    var _currentWidget;
    var _currentHandler;
    var defaultTarget = '.page-content';
    var RabbitCMS = (function () {
        function RabbitCMS() {
        }
        RabbitCMS.init = function (options) {
            var _this = this;
            options = $.extend(true, {
                handlers: [],
                path: ''
            }, options);
            _path = options.path;
            _handlers = options.handlers.map(function (h) {
                if (!(h.regex instanceof RegExp)) {
                    h.regex = new RegExp('^' + h.handler);
                }
                return h;
            }).sort(function (a, b) { return b.regex.source.length - a.regex.source.length; });
            console.log(_handlers);
            window.onpopstate = function (e) {
                var link = (e.state && e.state.link && e.state.link !== '') ? e.state.link : _pathname;
                return !_this.navigate(link, false);
            };
            $(function () { return _this.ready(); });
        };
        RabbitCMS.ready = function () {
            var _this = this;
            $body = $('body');
            $body.on('click', '[rel="back"]', function (event) {
                if (history.state !== null) {
                    history.back();
                }
                else {
                    var a = event.currentTarget;
                    return !_this.navigate(a.pathname, false);
                }
                return false;
            });
            $body.on('click', 'a', function (event) {
                var a = event.currentTarget;
                if (a.hostname != location.hostname) {
                    return true;
                }
                return !_this.navigate(a.pathname);
            });
            var handler = this.findHandler(location.pathname);
            if (handler !== void 0) {
                _currentHandler = handler;
                var widget = $('[data-require]:first', defaultTarget);
                this.loadModuleByHandler(handler, widget);
                this.showPortlet(handler, widget);
            }
            $('[data-require]').each(function (i, e) {
                _this.loadModule($(e));
            });
            this.updatePlugins();
            this.initSidebar();
        };
        RabbitCMS.findHandler = function (link) {
            link = link.length > 1 ? link.replace(/\/$/, '') : link;
            return _handlers.find(function (h) {
                return new RegExp('^' + h.handler).exec(link) !== null;
            }) || null;
        };
        RabbitCMS.getPath = function () {
            return _path;
        };
        RabbitCMS.setToken = function (value) {
            _token = value;
        };
        RabbitCMS.getToken = function () {
            return _token;
        };
        ;
        RabbitCMS.loadModuleByHandler = function (handler, widget) {
            if (widget.data('loaded')) {
                return;
            }
            widget.data('loaded', true);
            this.updatePlugins(widget);
            require([handler.module], function (_module) {
                console.log(_module);
                if (handler.exec !== void 0) {
                    _module[handler.exec](widget);
                }
                else {
                    _module.init(widget);
                }
            });
        };
        RabbitCMS.loadModule = function (widget) {
            if (widget.data('loaded')) {
                return;
            }
            widget.data('loaded', true);
            this.updatePlugins(widget);
            var _module = widget.data('require');
            if (_module) {
                var _tmp_1 = _module.split(':');
                require([_tmp_1[0]], function (_module) {
                    if (_tmp_1.length === 2) {
                        _module[_tmp_1[1]](widget);
                    }
                    else {
                        _module.init(widget);
                    }
                });
            }
        };
        RabbitCMS.navigateByHandler = function (h, link, pushState) {
            var _this = this;
            if (pushState === void 0) { pushState = true; }
            if (h.widget instanceof jQuery) {
                if (this.showPortlet(h, h.widget) && pushState && h.pushState !== false) {
                    history.pushState({ link: link }, null, link);
                }
            }
            else if (link !== void 0) {
                this.ajax(link, function (data) {
                    var widget = $(data);
                    _this.loadModuleByHandler(h, widget);
                    if (_this.showPortlet(h, widget) && pushState && h.pushState !== false) {
                        history.pushState({ link: link }, null, link);
                    }
                });
            }
        };
        RabbitCMS.navigate = function (link, pushState) {
            if (pushState === void 0) { pushState = true; }
            var h = this.findHandler(link);
            if (h && h.ajax !== false) {
                this.navigateByHandler(h, link, pushState);
                return true;
            }
            return false;
        };
        RabbitCMS.showPortlet = function (h, widget) {
            if (_currentWidget == widget)
                return false;
            if (_currentHandler && _currentWidget) {
                if (_currentHandler.permanent) {
                    _currentHandler.widget = _currentWidget;
                    _currentWidget.detach();
                }
                else {
                    _currentWidget.remove();
                }
            }
            _currentHandler = h;
            _currentWidget = widget;
            widget.appendTo(defaultTarget);
            this.canSubmit.init();
            this.scrollTop();
            return true;
        };
        RabbitCMS.loadModalWindow = function (link, callback) {
            var _this = this;
            this.ajax(link, function (data) {
                var modal = $(data);
                $('.page-content').append(modal);
                _this.showModal(modal);
                if ($.isFunction(callback))
                    callback(modal);
            });
        };
        RabbitCMS.showModal = function (modal) {
            $('.ajax-modal').each(function (i, e) {
                var el = $(e);
                if (el != modal && el.data('permanent') === undefined)
                    el.remove();
            });
            if (modal.length)
                modal.modal();
            else
                this.dangerMessage('Помилка. RabbitCMS.prototype.showModal');
        };
        RabbitCMS.getUniqueID = function (prefix) {
            if (prefix === void 0) { prefix = ''; }
            return prefix + '_' + Math.floor(Math.random() * (new Date()).getTime());
        };
        RabbitCMS.alert = function (options) {
            options = $.extend(true, {
                container: "",
                place: "append",
                type: 'success',
                message: "",
                close: true,
                reset: true,
                focus: true,
                closeInSeconds: 0,
                icon: ""
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
                }
                else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').length === 0) {
                    $('.page-title').after(html);
                }
                else {
                    var $page_bar = $('.page-bar');
                    if ($page_bar.length > 0) {
                        $page_bar.after(html);
                    }
                    else {
                        $('.page-breadcrumb, .breadcrumbs').after(html);
                    }
                }
            }
            else {
                if (options.place == "append") {
                    $(options.container).append(html);
                }
                else {
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
        };
        RabbitCMS.uniformUpdate = function (selector) {
            require(['jquery.uniform'], function () {
                $.uniform.update(selector);
            });
        };
        RabbitCMS.message = function (options) {
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
        };
        RabbitCMS.dangerMessage = function (message, container) {
            var options = { container: container, type: 'danger', message: message, icon: 'fa-warning' };
            this.message(options);
        };
        RabbitCMS.scrollTo = function (element, offset) {
            if (offset === void 0) { offset = -1; }
            var position = (element && element.length > 0) ? element.offset().top : 0;
            if (element) {
                if ($body.hasClass('page-header-fixed')) {
                    position = position - $('.page-header').height();
                }
                position = position + offset * element.height();
            }
            $('html, body').animate({ scrollTop: position }, 'slow');
        };
        RabbitCMS.scrollTop = function () {
            this.scrollTo();
        };
        RabbitCMS.getViewPort = function () {
            var e = window;
            var a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return {
                width: e[a + 'Width'],
                eight: e[a + 'Height']
            };
        };
        RabbitCMS.updatePlugins = function (target) {
            var select2 = $('.select2', target);
            if (select2.length) {
                require(['select2'], function () {
                    select2.select2();
                });
            }
        };
        RabbitCMS.initSidebar = function () {
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
                }
                else {
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
                }
                else {
                    $('.arrow', $(this)).addClass('open');
                    $(this).parent('li').addClass('open');
                    subMenu.slideDown(slideSpeed);
                }
                e.preventDefault();
            });
        };
        RabbitCMS.blockUI = function (target, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            require(['jquery.blockui'], function () {
                var html = '';
                if (options.animate) {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
                }
                else if (options.iconOnly) {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + _this.getPath() + '/img/loading-spinner-grey.gif" align=""></div>';
                }
                else if (options.textOnly) {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
                }
                else {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + _this.getPath() + '/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
                }
                if (target) {
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
                }
                else {
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
        };
        RabbitCMS.unblockUI = function (target) {
            require(['jquery.blockui'], function () {
                if (target) {
                    $(target).unblock({
                        onUnblock: function () {
                            $(target).css({ position: '', zoom: '' });
                        }
                    });
                }
                else
                    $.unblockUI();
            });
        };
        RabbitCMS.submitForm = function (form, callback) {
            var _this = this;
            form = (form instanceof $) ? form : $(form);
            var link = form.attr('action');
            var data = form.serialize();
            this.ajaxPost(link, data, function (data) {
                _this.canSubmit._match = true;
                $('[rel="back"]:first', _visiblePortlet).trigger('click');
                if ($.isFunction(callback))
                    callback(data);
            });
        };
        RabbitCMS.ajax = function (link, callback) {
            this._ajax({ url: link }, callback);
        };
        RabbitCMS.ajaxPost = function (link, data, callback) {
            this._ajax({ url: link, method: 'POST', data: data }, callback);
        };
        RabbitCMS._ajax = function (options, callback) {
            var _this = this;
            options = $.extend(true, {
                success: function (data) {
                    if ($.isFunction(callback))
                        callback(data);
                    _this.unblockUI();
                },
                error: function (jqXHR) {
                    switch (jqXHR.status) {
                        case 404:
                            _this.dangerMessage('Сторінку не знайдено');
                            break;
                        case 403:
                            _this.dangerMessage('Доступ заборонено. Зверніться до адміністратора');
                            break;
                        case 401:
                            location.reload(true);
                            break;
                        case 503:
                            var responseText;
                            try {
                                responseText = $.parseJSON(jqXHR.responseText);
                            }
                            catch (message) {
                                responseText = { message: message };
                            }
                            _this.dangerMessage('Помилка ' + jqXHR.status + '. ' + responseText.message);
                            break;
                        default:
                            _this.dangerMessage('Помилка ' + jqXHR.status + '. ' + jqXHR.statusText);
                    }
                    _this.unblockUI();
                }
            }, options);
            this.blockUI();
            $.ajax(options);
        };
        RabbitCMS.validate = function (form, options) {
            var _this = this;
            options = $.extend(true, {
                focusInvalid: true,
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorPlacement: function () {
                },
                submitHandler: function (form) {
                    _this.submitForm(form, options.completeSubmit);
                },
                completeSubmit: function () {
                }
            }, options);
            require(['jquery.validation'], function () {
                form.validate(options);
            });
        };
        RabbitCMS.select2 = function (selector, options) {
            if (options === void 0) { options = {}; }
            require(['select2'], function () {
                $.fn.select2.defaults.set("theme", "bootstrap");
                options.allowClear = true;
                options.width = 'auto';
                selector.select2(options);
            });
        };
        RabbitCMS.canSubmit = {
            _match: false,
            init: function () {
                this.form = _visiblePortlet.find('form');
                this._match = false;
                if (this.form.length)
                    this.initData = $('.form-change', this.form).serialize();
            },
            check: function (event) {
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
        RabbitCMS.Dialogs = {
            onDelete: function (link, callback) {
                require(['bootbox'], function (bootbox) {
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
                require(['bootbox'], function (bootbox) {
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
        RabbitCMS.Tools = {
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
                    }
                    else {
                        result += text[i];
                        char = text[i];
                    }
                }
                return $.trim(result);
            }
        };
        return RabbitCMS;
    }());
    exports.RabbitCMS = RabbitCMS;
    var MicroEvent = (function () {
        function MicroEvent(object) {
            var _this = this;
            this._events = {};
            if (object !== void 0) {
                Object.keys(object).forEach(function (key) {
                    _this[key] = object[key];
                }, this);
            }
        }
        MicroEvent.prototype.bind = function (event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        };
        MicroEvent.prototype.unbind = function (event, fct) {
            this._events = this._events || {};
            if (event in this._events === false)
                return;
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        };
        MicroEvent.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._events = this._events || {};
            if (event in this._events === false)
                return;
            for (var i = 0, l = this._events[event].length; i < l; i++) {
                this._events[event][i].apply(this, args);
            }
        };
        return MicroEvent;
    }());
    exports.MicroEvent = MicroEvent;
});
//# sourceMappingURL=rabbitcms.backend.js.map