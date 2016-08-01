define(["require", "exports", "jquery", "i18n!rabbitcms/nls/backend", "rabbitcms/metronic", "jquery.cookie"], function (require, exports, $, i18n, metronic_1) {
    "use strict";
    var $body = $('body');
    var _visiblePortlet = $();
    var _token = '';
    var _currentHandler;
    var defaultTarget = '.page-content';
    var State = (function () {
        function State(link, handler, widget) {
            this.checkers = [];
            this.link = link;
            this.handler = handler;
            this.widget = widget;
        }
        State.prototype.check = function (replay) {
            return Promise.all(this.checkers.map(function (a) { return a(replay); }));
        };
        State.prototype.addChecker = function (checker) {
            this.checkers.push(checker);
        };
        return State;
    }());
    exports.State = State;
    (function (StateType) {
        StateType[StateType["NoPush"] = 0] = "NoPush";
        StateType[StateType["None"] = 1] = "None";
        StateType[StateType["Push"] = 2] = "Push";
        StateType[StateType["Replace"] = 3] = "Replace";
    })(exports.StateType || (exports.StateType = {}));
    var StateType = exports.StateType;
    var Stack = (function (_super) {
        __extends(Stack, _super);
        function Stack() {
            var _this = this;
            _super.call(this);
            this._position = -1;
            this._previous = -1;
            this.index = 0;
            if (history.state && history.state.index) {
                this.index = history.state.index;
            }
            window.addEventListener('popstate', function (e) {
                _this.handleEvent = null;
                if (e.state && e.state.index !== void 0) {
                    _this.index = history.state.index;
                }
                if (e.state && e.state.state !== void 0) {
                    var index_1 = _this.index;
                    _this.go(e.state.state, e.state.link, function () {
                        history.go(index_1 - _this.index);
                    });
                }
                else if (e.state && e.state.link) {
                    RabbitCMS.navigate(e.state.link, StateType.NoPush);
                }
                else {
                    RabbitCMS.navigate(location.pathname, StateType.NoPush);
                }
            });
        }
        Object.defineProperty(Stack.prototype, "current", {
            get: function () {
                return this.fetch(this._position);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stack.prototype, "previous", {
            get: function () {
                return this.fetch(this._previous);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stack.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        Stack.prototype.add = function (state, type) {
            if (type === void 0) { type = StateType.Push; }
            this.length = this._position + 1;
            this._previous = this._position;
            this._position = _super.prototype.push.call(this, state) - 1;
            switch (type) {
                case StateType.Push:
                    history.pushState({ state: this._position, link: state.link, index: ++this.index }, null, state.link);
                    break;
                case StateType.Replace:
                    history.replaceState({ state: this._position, link: state.link, index: this.index }, null, state.link);
                    break;
            }
            return this._position;
        };
        Stack.prototype.fetch = function (index) {
            if (index < 0) {
                return null;
            }
            if (index >= this.length) {
                return null;
            }
            return this[index];
        };
        Stack.prototype.go = function (index, link, replay) {
            var _this = this;
            if (index === this._position && this.current.link === link) {
                return;
            }
            var s = this.fetch(index);
            if (s && s.link == link) {
                var previous_1 = this._previous;
                this._previous = this._position;
                RabbitCMS.navigateByHandler(s.handler, s.link, StateType.NoPush, replay).then(function () {
                    _this._position = index;
                }, function () {
                    _this._previous = previous_1;
                    if (index > _this._position) {
                        history.back();
                    }
                    else {
                        history.forward();
                    }
                });
            }
            else {
                RabbitCMS.navigate(link, StateType.Replace, replay).catch(function () {
                    if (index > _this._position) {
                        history.back();
                    }
                    else {
                        history.forward();
                    }
                });
            }
        };
        return Stack;
    }(Array));
    var RabbitCMS = (function (_super) {
        __extends(RabbitCMS, _super);
        function RabbitCMS() {
            _super.apply(this, arguments);
        }
        RabbitCMS.init = function (options) {
            options = $.extend(true, {
                handlers: [],
            }, options);
            this._handlers = options.handlers.map(function (h) {
                if (!(h.regex instanceof RegExp)) {
                    h.regex = new RegExp('^' + h.handler);
                }
                return h;
            }).sort(function (a, b) { return b.regex.source.length - a.regex.source.length; });
            _super.init.call(this, options);
        };
        RabbitCMS.ready = function () {
            var _this = this;
            _super.ready.call(this);
            $body = $('body');
            $body.on('click', '[rel="back"]', function (event) {
                if (history.state !== null) {
                    history.back();
                }
                else {
                    var a = event.currentTarget;
                    _this.navigate(a.pathname, StateType.NoPush);
                }
                return false;
            });
            $body.on('click', 'a:not([href^="#"])', function (event) {
                if ($(event.target).attr('rel') === 'back') {
                    return false;
                }
                var a = event.currentTarget;
                if (a.hostname != location.hostname) {
                    return true;
                }
                if (_this.navigate(a.pathname, StateType.Push) !== null) {
                    event.preventDefault();
                }
            });
            var link = location.pathname.length > 1 ? location.pathname.replace(/\/$/, '') : location.pathname;
            var handler = this.findHandler(link);
            if (handler) {
                _currentHandler = handler;
                var widget = $('[data-require]:first', defaultTarget);
                this._stack.add(new State(link, handler, widget), StateType.Replace);
                this.loadModuleByHandler(handler, widget, this._stack.current);
                this.showPortlet(handler, widget);
            }
            $('[data-require]').each(function (i, e) {
                _this.loadModule($(e));
            });
            this.initSidebar();
        };
        RabbitCMS.findHandler = function (link) {
            link = link.length > 1 ? link.replace(/\/$/, '') : link;
            return this._handlers.find(function (h) {
                return new RegExp('^' + h.handler + '$').exec(link) !== null;
            }) || null;
        };
        RabbitCMS.setToken = function (value) {
            _token = value;
        };
        RabbitCMS.getToken = function () {
            return _token;
        };
        RabbitCMS.setLocale = function (locale) {
            this._locale = locale;
        };
        RabbitCMS.getLocale = function (map) {
            return map && map.has(this._locale) ? map.get(this._locale) : this._locale;
        };
        RabbitCMS.loadModuleByHandler = function (handler, widget, state) {
            if (widget.data('loaded')) {
                return;
            }
            widget.data('loaded', true);
            this.updatePlugins(widget);
            require([handler.module], function (_module) {
                if (handler.exec !== void 0) {
                    _module[handler.exec](widget, state);
                }
                else {
                    _module.init(widget, state);
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
        RabbitCMS.navigateByHandler = function (h, link, pushState, replay) {
            var _this = this;
            if (pushState === void 0) { pushState = StateType.Push; }
            if (!replay) {
                replay = function () { return _this.navigateByHandler(h, link, pushState, replay); };
            }
            return new Promise(function (resolve, reject) {
                var current = _this._stack.current || new State(null, null, null);
                if (h.widget instanceof jQuery) {
                    if (current.widget === h.widget) {
                        resolve(false);
                        return;
                    }
                    current.check(replay).then(function () {
                        if (pushState !== StateType.NoPush) {
                            _this._stack.add(new State(link, h, h.widget), h.pushState || pushState);
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                        _this.showPortlet(h, h.widget);
                    }, function () {
                        reject();
                    });
                }
                else if (link !== void 0) {
                    current.check(replay).then(function () {
                        _this.ajax({
                            url: link, success: function (data) {
                                var widget = $(data);
                                var state = new State(link, h, widget);
                                _this._stack.add(state, h.pushState || pushState);
                                _this.loadModuleByHandler(h, widget, state);
                                _this.showPortlet(h, widget);
                                resolve(true);
                            }
                        });
                    }, function () {
                        reject();
                    });
                }
                else {
                    reject();
                }
            });
        };
        RabbitCMS.navigate = function (link, pushState, replay) {
            if (pushState === void 0) { pushState = StateType.Push; }
            var h = this.findHandler(link);
            if (h && h.ajax !== false) {
                return this.navigateByHandler(h, link, pushState, replay);
            }
            return null;
        };
        RabbitCMS.showPortlet = function (h, widget) {
            if (h.menuPath) {
                this.setMenu(h.menuPath);
            }
            var previous = this._stack.previous;
            if (previous) {
                if (previous.handler.permanent) {
                    previous.handler.widget = this._stack.previous.widget;
                    previous.widget.detach();
                }
                else {
                    previous.widget.remove();
                }
            }
            widget.appendTo(defaultTarget);
            this.scrollTop();
            return true;
        };
        RabbitCMS.loadModalWindow = function (link, callback) {
            var _this = this;
            this.ajax({
                url: link,
                success: function (data, textStatus, jqXHR) {
                    var modal = $(data);
                    $('.page-content').append(modal);
                    if ($.isFunction(callback)) {
                        callback(modal, data, textStatus, jqXHR);
                    }
                    _this.showModal(modal);
                }
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
        RabbitCMS.dangerMessage = function (message, target) {
            var options = { container: target, type: 'danger', message: message, icon: 'fa-warning' };
            this.message(options);
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
                height: e[a + 'Height']
            };
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
        RabbitCMS.setMenu = function (menu) {
            this.menu = menu;
            $('li[data-path]', '.page-sidebar-menu').removeClass('active open').each(function (i, e) {
                var el = $(e);
                if ((menu + '.').startsWith($(e).data('path') + '.')) {
                    el.addClass('active open');
                }
            });
        };
        RabbitCMS.ajax = function (options) {
            var _this = this;
            var originalOptions = options;
            options = $.extend(true, {}, options);
            options.beforeSend = function (jqXHR, settings) {
                jqXHR.setRequestHeader('X-CSRF-TOKEN', _this.getToken());
                if ($.isFunction(originalOptions.beforeSend)) {
                    return originalOptions.beforeSend(jqXHR, settings);
                }
            };
            options.error = function (jqXHR, textStatus, errorThrown) {
                if ($.isFunction(originalOptions.error) && originalOptions.error(jqXHR, textStatus, errorThrown)) {
                    return;
                }
                switch (jqXHR.status) {
                    case 404:
                        _this.dangerMessage(i18n.pageNotFound, options.warningTarget);
                        break;
                    case 403:
                        _this.dangerMessage(i18n.accessDenied, options.warningTarget);
                        break;
                    case 401:
                        location.reload(true);
                        break;
                    default:
                        var responseText = void 0;
                        try {
                            responseText = $.parseJSON(jqXHR.responseText);
                        }
                        catch (message) {
                            responseText = { message: message };
                        }
                        _this.dangerMessage('Error: ' + jqXHR.status + '. ' + responseText.message, options.warningTarget);
                        break;
                }
            };
            options.complete = function (jqXHR, textStatus) {
                RabbitCMS.unblockUI(options.blockTarget);
                if ($.isFunction(originalOptions.complete)) {
                    originalOptions.complete(jqXHR, textStatus);
                }
            };
            this.blockUI(options.blockTarget, options.blockOptions);
            return $.ajax(options);
        };
        RabbitCMS._stack = new Stack();
        RabbitCMS.menu = '';
        RabbitCMS._locale = 'en';
        RabbitCMS._handlers = [];
        return RabbitCMS;
    }(metronic_1.Metronic));
    exports.RabbitCMS = RabbitCMS;
    var Dialogs = (function () {
        function Dialogs() {
        }
        Dialogs.confirm = function (message, options) {
            return new Promise(function (resolve, reject) {
                require(['bootbox'], function (bootbox) {
                    bootbox.dialog($.extend(true, {
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
        };
        Dialogs.onDelete = function (ajax, message, options) {
            return this.confirm(message || i18n.youWantDeleteThis, options).then(function () { return RabbitCMS.ajax(ajax); });
        };
        return Dialogs;
    }());
    exports.Dialogs = Dialogs;
    var Tools = (function () {
        function Tools() {
        }
        Tools.transliterate = function (string, spase) {
            if (spase === void 0) { spase = '-'; }
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
        };
        return Tools;
    }());
    exports.Tools = Tools;
    var Form = (function () {
        function Form(form, options) {
            var _this = this;
            this.match = false;
            this.form = form;
            this.options = $.extend(true, {
                validate: null,
                completeSubmit: function () {
                }
            }, options);
            if (this.options.state && this.options.dialog !== false) {
                this.options.state.addChecker(function (replay) { return new Promise(function (resolve, reject) {
                    if (!_this.match && _this.data !== _this.getData()) {
                        require(['bootbox'], function (bootbox) {
                            var dialog = $.extend(true, {
                                message: '<h4>' + i18n.dataHasBeenModified + '</h4>',
                                closeButton: false,
                                buttons: {
                                    save: {
                                        label: i18n.save,
                                        className: 'btn-sm btn-success btn-green',
                                        callback: function () {
                                            _this.form.submit();
                                        }
                                    },
                                    cancel: {
                                        label: i18n.dontSave,
                                        className: 'btn-sm btn-danger',
                                        callback: function () {
                                            _this.match = true;
                                            (replay || function () {
                                            })();
                                        }
                                    },
                                    close: {
                                        label: i18n.close,
                                        className: 'btn-sm'
                                    }
                                }
                            }, _this.options.dialog);
                            bootbox.dialog(dialog);
                        });
                        reject();
                    }
                    else {
                        _this.match = false;
                        resolve();
                    }
                }); });
            }
            if (this.options.validation !== false) {
                require(['rabbitcms/loader/validation'], function () {
                    var options = $.extend(true, {
                        submitHandler: function () {
                            _this.submitForm();
                        }
                    }, _this.options.validation);
                    form.validate(options);
                });
            }
            else {
                form.on('submit', function () {
                    _this.submitForm();
                });
            }
            this.syncOriginal();
        }
        Form.prototype.syncOriginal = function () {
            this.data = this.getData();
        };
        Form.prototype.getData = function () {
            return $('input:not(.ignore-scan),select:not(.ignore-scan),textarea:not(.ignore-scan)', this.form).serialize();
        };
        Form.prototype.submitForm = function () {
            var _this = this;
            this.syncOriginal();
            if (this.options.ajax !== false) {
                RabbitCMS.ajax({
                    url: this.form.attr('action'),
                    method: this.form.attr('method'),
                    data: this.data,
                    success: function () {
                        if (!_this.options.completeSubmit()) {
                            history.back();
                        }
                    }
                });
            }
            else {
                this.form[0].submit();
                this.options.completeSubmit();
            }
        };
        return Form;
    }());
    exports.Form = Form;
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
//# sourceMappingURL=backend.js.map