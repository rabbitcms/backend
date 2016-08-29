define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    (function (ResponsiveBreakpointSize) {
        ResponsiveBreakpointSize[ResponsiveBreakpointSize["xs"] = 480] = "xs";
        ResponsiveBreakpointSize[ResponsiveBreakpointSize["sm"] = 768] = "sm";
        ResponsiveBreakpointSize[ResponsiveBreakpointSize["md"] = 992] = "md";
        ResponsiveBreakpointSize[ResponsiveBreakpointSize["lg"] = 1200] = "lg";
    })(exports.ResponsiveBreakpointSize || (exports.ResponsiveBreakpointSize = {}));
    var ResponsiveBreakpointSize = exports.ResponsiveBreakpointSize;
    var BrandColors = (function () {
        function BrandColors() {
        }
        BrandColors.blue = '#89C4F4';
        BrandColors.red = '#F3565D';
        BrandColors.green = '#1bbc9b';
        BrandColors.purple = '#9b59b6';
        BrandColors.grey = '#95a5a6';
        BrandColors.yellow = '#F8CB00';
        return BrandColors;
    }());
    exports.BrandColors = BrandColors;
    var Metronic = (function () {
        function Metronic() {
        }
        Metronic._handleOnResize = function () {
            var _this = this;
            var resize;
            $(window).on('resize', function () {
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    _this._runResizeHandlers();
                }, 50);
            });
        };
        Metronic.init = function (options) {
            var _this = this;
            options = $.extend({
                assetsPath: '../assets/'
            }, options);
            this.assetsPath = options.assetsPath;
            this._isRTL = options.hasOwnProperty('rtl') ? options.rtl : $('body').css('direction') === 'rtl';
            $(function () { return _this.ready(); });
        };
        Metronic._handleMaterialDesign = function () {
            var $body = $('body');
            $body.on('click', '.md-checkbox > label, .md-radio > label', function () {
                var the = $(this);
                var el = $(this).children('span:first-child');
                el.addClass('inc');
                var newone = el.clone(true);
                el.before(newone);
                $("." + el.attr("class") + ":last", the).remove();
            });
            if ($body.hasClass('page-md')) {
                var element, circle, d, x, y;
                $body.on('click', 'a.btn, button.btn, input.btn, label.btn', function (e) {
                    element = $(e.currentTarget);
                    if (element.find(".md-click-circle").length == 0) {
                        element.prepend("<span class='md-click-circle'></span>");
                    }
                    circle = element.find(".md-click-circle");
                    circle.removeClass("md-click-animate");
                    if (!circle.height() && !circle.width()) {
                        d = Math.max(element.outerWidth(), element.outerHeight());
                        circle.css({ height: d, width: d });
                    }
                    x = e.pageX - element.offset().left - circle.width() / 2;
                    y = e.pageY - element.offset().top - circle.height() / 2;
                    circle.css({ top: y + 'px', left: x + 'px' }).addClass("md-click-animate");
                    setTimeout(function () {
                        circle.remove();
                    }, 1000);
                });
            }
            var handleInput = function (el) {
                if (el.val() != "") {
                    el.addClass('edited');
                }
                else {
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
        };
        Metronic.handleiCheck = function (target) {
            var iCheck = $('.icheck', target);
            if (iCheck.length > 0) {
                require(['rabbitcms/loader/icheck'], function () {
                    iCheck.each(function (index, elem) {
                        var $elem = $(elem);
                        var checkboxClass = $elem.attr('data-checkbox') ? $elem.attr('data-checkbox') : 'icheckbox_minimal-grey';
                        var radioClass = $elem.attr('data-radio') ? $elem.attr('data-radio') : 'iradio_minimal-grey';
                        if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
                            $elem.iCheck({
                                checkboxClass: checkboxClass,
                                radioClass: radioClass,
                                insert: '<div class="icheck_line-icon"></div>' + $elem.attr("data-label")
                            });
                        }
                        else {
                            $elem.iCheck({
                                checkboxClass: checkboxClass,
                                radioClass: radioClass
                            });
                        }
                    });
                });
            }
        };
        Metronic.handleBootstrapSwitch = function (target) {
            var bSwitch = $('.make-switch', target);
            if (bSwitch.length > 0) {
                require(['rabbitcms/loader/bootstrap-switch'], function () {
                    bSwitch.bootstrapSwitch();
                });
            }
        };
        Metronic.handleSelect2 = function (target, options) {
            if (options === void 0) { options = {}; }
            var select2 = $('.select2me', target);
            if (select2.length > 0) {
                require(['rabbitcms/loader/jquery.select2'], function () {
                    $('.select2me', target).select2(options);
                });
            }
        };
        Metronic.handleScrollers = function (target) {
            this.initSlimScroll($('.scroller', target));
        };
        Metronic.initSlimScroll = function (el) {
            var _this = this;
            require(['slimScroll'], function () {
                el.each(function (index, elem) {
                    var $elem = $(elem);
                    if ($elem.attr("data-initialized")) {
                        return;
                    }
                    var height;
                    if ($elem.attr("data-height")) {
                        height = $elem.attr("data-height");
                    }
                    else {
                        height = $elem.css('height');
                    }
                    $elem.slimScroll({
                        allowPageScroll: true,
                        size: '7px',
                        color: ($elem.attr("data-handle-color") ? $elem.attr("data-handle-color") : '#bbb'),
                        wrapperClass: ($elem.attr("data-wrapper-class") ? $elem.attr("data-wrapper-class") : 'slimScrollDiv'),
                        railColor: ($elem.attr("data-rail-color") ? $elem.attr("data-rail-color") : '#eaeaea'),
                        position: _this.isRTL() ? 'left' : 'right',
                        height: height,
                        alwaysVisible: ($elem.attr("data-always-visible") == "1" ? true : false),
                        railVisible: ($elem.attr("data-rail-visible") == "1" ? true : false),
                        disableFadeOut: true
                    });
                    $elem.attr("data-initialized", "1");
                });
            });
        };
        Metronic.destroySlimScroll = function (el) {
            require(['slimScroll'], function () {
                el.each(function (index, elem) {
                    var $elem = $(elem);
                    if ($elem.attr("data-initialized") === "1") {
                        $elem.removeAttr("data-initialized");
                        $elem.removeAttr("style");
                        var attrList = {};
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
                        $.each(attrList, function (key, value) {
                            $elem.attr(key, value);
                        });
                    }
                });
            });
        };
        Metronic.handleFancybox = function (target) {
            var fancybox = $(".fancybox-button", target);
            if (fancybox.length > 0) {
                require(['jquery.fancybox'], function () {
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
        };
        Metronic.select2 = function (target, options) {
            if (options === void 0) { options = {}; }
            require(['rabbitcms/loader/jquery.select2'], function () {
                target.select2(options);
            });
        };
        Metronic.datePicker = function (target, options) {
            if (options === void 0) { options = {}; }
            require(['rabbitcms/loader/bootstrap-datepicker'], function (promise) {
                promise.then(function () {
                    target.datepicker(options);
                });
            });
        };
        Metronic.handlePortletTools = function () {
            var _this = this;
            var $body = $('body');
            $body.on('click', '.portlet > .portlet-title > .tools > a.remove', function (e) {
                e.preventDefault();
                var portlet = $(e.currentTarget).closest(".portlet");
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
            $body.on('click', '.portlet > .portlet-title .fullscreen', function (e) {
                var $elem = $(e.currentTarget);
                e.preventDefault();
                var portlet = $elem.closest(".portlet");
                if (portlet.hasClass('portlet-fullscreen')) {
                    $elem.removeClass('on');
                    portlet.removeClass('portlet-fullscreen');
                    $body.removeClass('page-portlet-fullscreen');
                    portlet.children('.portlet-body').css('height', 'auto');
                }
                else {
                    var height = _this.getViewPort().height -
                        portlet.children('.portlet-title').outerHeight() -
                        parseInt(portlet.children('.portlet-body').css('padding-top')) -
                        parseInt(portlet.children('.portlet-body').css('padding-bottom'));
                    $elem.addClass('on');
                    portlet.addClass('portlet-fullscreen');
                    $body.addClass('page-portlet-fullscreen');
                    portlet.children('.portlet-body').css('height', height);
                }
            });
            $('.portlet .portlet-title a.reload[data-load="true"]').click();
            $body.on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
                e.preventDefault();
                var el = $(this).closest(".portlet").children(".portlet-body");
                if ($(this).hasClass("collapse")) {
                    $(this).removeClass("collapse").addClass("expand");
                    el.slideUp(200);
                }
                else {
                    $(this).removeClass("expand").addClass("collapse");
                    el.slideDown(200);
                }
            });
        };
        Metronic.handleAlerts = function () {
            var $body = $('body');
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
        };
        Metronic.handleDropdowns = function () {
            $('body').on('click', '.dropdown-menu.hold-on-click', function (e) {
                e.stopPropagation();
            });
        };
        Metronic.handleTabDrops = function (target) {
            var elms = $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs', target);
            if (elms.length > 0) {
                require(['rabbitcms/loader/bootstrap-tabdrop'], function () {
                    elms.tabdrop({
                        text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
                    });
                });
            }
        };
        Metronic.initTabs = function () {
            var hash = encodeURI(location.hash);
            if (hash) {
                hash.substr(1).split(',').forEach(function (tabid) {
                    var tab = $('a[href="#' + tabid + '"]');
                    tab.parents('.tab-pane:hidden').each(function (index, elem) {
                        var tabid = $(elem).attr("id");
                        $('a[href="#' + tabid + '"]').click();
                    });
                    tab.click();
                });
            }
        };
        ;
        Metronic.handleTooltips = function (target) {
            $('.tooltips', target).tooltip();
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
        };
        Metronic.handlePopovers = function (target) {
            $('.popovers', target).popover();
        };
        Metronic.initPopovers = function () {
            var _this = this;
            $(document).on('click.bs.popover.data-api', function () {
                if (_this.lastPopedPopover) {
                    _this.lastPopedPopover.popover('hide');
                }
            });
        };
        Metronic.setLastPopedPopover = function (el) {
            this.lastPopedPopover = el;
        };
        Metronic.initAccordions = function () {
            var _this = this;
            $('body').on('shown.bs.collapse', '.accordion.scrollable', function (e) {
                _this.scrollTo($(e.target));
            });
        };
        Metronic.initModals = function () {
            var $body = $('body');
            $body.on('hide.bs.modal', function () {
                $('html').toggleClass('modal-open', $('.modal:visible').length > 1);
            });
            $body.on('show.bs.modal', '.modal', function () {
                if ($(this).hasClass("modal-scroll")) {
                    $('body').addClass("modal-open-noscroll");
                }
            });
            $body.on('hidden.bs.modal', '.modal', function () {
                $body.removeClass("modal-open-noscroll");
            });
            $body.on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
                $(this).removeData('bs.modal');
            });
        };
        Metronic.handleBootstrapConfirmation = function (target) {
            var elms = $('[data-toggle=confirmation]', target);
            if (elms.length > 0) {
                require(['bootstrap-confirmation.d'], function () {
                    elms.confirmation({
                        btnOkClass: 'btn btn-sm btn-success',
                        btnCancelClass: 'btn btn-sm btn-danger'
                    });
                });
            }
        };
        Metronic.handleCounterup = function (target) {
            var elms = $("[data-counter='counterup']", target);
            if (elms.length > 0) {
                require(['rabbitcms/loader/counterup'], function () {
                    elms.counterUp({
                        delay: 10,
                        time: 1000
                    });
                });
            }
        };
        Metronic.updatePlugins = function (target) {
            this.handleiCheck(target);
            this.handleBootstrapSwitch(target);
            this.handleScrollers(target);
            this.handleSelect2(target);
            this.handleFancybox(target);
            this.handleTabDrops(target);
            this.handleTooltips(target);
            this.handlePopovers(target);
            this.handleBootstrapConfirmation(target);
            this.handleCounterup(target);
        };
        Metronic.ready = function () {
            this._handleOnResize();
            this._handleMaterialDesign();
            this.updatePlugins();
            this.handlePortletTools();
            this.handleAlerts();
            this.handleDropdowns();
            this.initTabs();
            this.initPopovers();
            this.initAccordions();
            this.initModals();
            this.addResizeHandler(function () {
                $('[data-auto-height]').each(function (index, elem) {
                    var parent = $(elem);
                    var items = $('[data-height]', parent);
                    var height = 0;
                    var mode = parent.attr('data-mode');
                    var offset = parseInt(parent.attr('data-offset')) || 0;
                    items.each(function (index, elem) {
                        var $elem = $(elem);
                        if ($elem.attr('data-height') == "height") {
                            $elem.css('height', '');
                        }
                        else {
                            $elem.css('min-height', '');
                        }
                        var height_ = (mode == 'base-height' ? $elem.outerHeight() : $elem.outerHeight(true));
                        if (height_ > height) {
                            height = height_;
                        }
                    });
                    height = height + offset;
                    items.each(function (index, elem) {
                        var $elem = $(elem);
                        if ($elem.attr('data-height') == "height") {
                            $elem.css('height', height);
                        }
                        else {
                            $elem.css('min-height', height);
                        }
                    });
                    if (parent.attr('data-related')) {
                        $(parent.attr('data-related')).css('height', parent.height());
                    }
                });
            });
        };
        Metronic.addResizeHandler = function (func) {
            this.resizeHandlers.push(func);
        };
        Metronic._runResizeHandlers = function () {
            this.resizeHandlers.forEach(function (handler) { return handler(); });
        };
        Metronic.runResizeHandlers = function () {
            this._runResizeHandlers();
        };
        Metronic.scrollTo = function (el, offset) {
            if (offset === void 0) { offset = 0; }
            var pos = (el && el.length > 0) ? el.offset().top : 0;
            var $body = $('body');
            if (el) {
                if ($body.hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                }
                else if ($body.hasClass('page-header-top-fixed')) {
                    pos = pos - $('.page-header-top').height();
                }
                else if ($body.hasClass('page-header-menu-fixed')) {
                    pos = pos - $('.page-header-menu').height();
                }
                pos = pos + (offset ? offset : -1 * el.height());
            }
            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        };
        Metronic.scrollTop = function () {
            this.scrollTo();
        };
        Metronic.blockUI = function (target, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            require(['jquery.blockui'], function () {
                var html = '';
                if (options.animate) {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
                }
                else if (options.iconOnly) {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + _this.getAssetsPath() + '/img/loading-spinner-grey.gif" align=""></div>';
                }
                else if (options.textOnly) {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
                }
                else {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + _this.getAssetsPath() + '/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
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
        Metronic.unblockUI = function (target) {
            require(['jquery.blockui'], function () {
                if (target) {
                    target.unblock({
                        onUnblock: function () {
                            target.css({ position: '', zoom: '' });
                        }
                    });
                }
                else
                    $.unblockUI();
            });
        };
        Metronic.stopPageLoading = function () {
            $('.page-loading, .page-spinner-bar').remove();
        };
        Metronic.alert = function (options) {
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
                var elm = $('.page-fixed-main-content');
                if (elm.length === 1) {
                    elm.prepend(html);
                }
                else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').length === 0) {
                    $('.page-title').after(html);
                }
                else {
                    var bar = $('.page-bar');
                    if (bar.length > 0) {
                        bar.after(html);
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
        Metronic.getActualVal = function (el) {
            el = $(el);
            if (el.val() === el.attr("placeholder")) {
                return "";
            }
            return el.val();
        };
        Metronic.getURLParameter = function (paramName) {
            var searchString = window.location.search.substring(1), i, val, params = searchString.split("&");
            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return decodeURIComponent(val[1]);
                }
            }
            return null;
        };
        Metronic.isTouchDevice = function () {
            try {
                document.createEvent("TouchEvent");
                return true;
            }
            catch (e) {
                return false;
            }
        };
        Metronic.getViewPort = function () {
            var e = window, a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        };
        Metronic.getUniqueID = function (prefix) {
            if (prefix === void 0) { prefix = ''; }
            return prefix + '_' + Math.floor(Math.random() * (new Date()).getTime());
        };
        Metronic.isRTL = function () {
            return this._isRTL;
        };
        Metronic.getAssetsPath = function () {
            return this.assetsPath;
        };
        Metronic.setAssetsPath = function (path) {
            this.assetsPath = path;
        };
        Metronic.getBrandColor = function (name) {
            return name in BrandColors ? BrandColors[name] : '';
        };
        Metronic.getResponsiveBreakpoint = function (size) {
            return size in ResponsiveBreakpointSize ? ResponsiveBreakpointSize[size] : 0;
        };
        Metronic._isRTL = false;
        Metronic.resizeHandlers = [];
        Metronic.assetsPath = '../assets/';
        return Metronic;
    }());
    exports.Metronic = Metronic;
});
//# sourceMappingURL=metronic.js.map