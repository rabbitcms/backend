var AdminWrapper = function () {
    'use strict';

    var _Body = $('body');
    var _FormPortlet = null;
    var globalOptions;
    var aWrapper;

    return {
        init: function (options) {
            globalOptions = $.extend(true, globalOptions, options);
            aWrapper = this;
        },

        /* 09.09.2015 */
        ShowAjaxModal: function (button, callback) {
            _Body.on('click', button, function (e) {
                e.preventDefault();

                aWrapper.blockPage();
                $('.ajax-modal').remove();
                $.ajax({
                    url: $(this).attr('href'),
                    success: function (data) {
                        $(data).insertAfter('.base-portlet');

                        if ($.isFunction(callback)) {
                            callback();
                        }

                        aWrapper.unblockPage();
                        $('.ajax-modal').modal();
                    },
                    error: function (jqXHR) {
                        aWrapper.unblockPage();
                        var container = $(button).parents('.portlet').find('.portlet-body');

                        switch (jqXHR.status) {
                            case 403:
                                aWrapper.showMessage(container, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                                break;
                            default:
                                aWrapper.showMessage(container, 'danger', 'Помилка завантаження даних');
                        }
                    }
                });
            });
        },
        SubmitAjaxModal: function (form, callback) {
            aWrapper.blockBox('.ajax-modal');
            $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                data: form.serialize(),
                success: function () {
                    aWrapper.unblockBox('.ajax-modal');

                    $('.ajax-modal').modal('hide');

                    if ($.isFunction(callback)) {
                        callback();
                    }
                },
                error: function (jqXHR) {
                    var _result = '';
                    try {
                        var _data = $.parseJSON(jqXHR.responseText);
                        _result = '<ul>';
                        $.each(_data, function (key, value) {
                            _result += '<li>' + value + '</li>';
                        });
                        _result += '</ul>';
                    } catch (message) {
                        _result = 'Помилка збереження даних';
                    }

                    aWrapper.unblockBox('.ajax-modal');
                    switch (jqXHR.status) {
                        case 403:
                            aWrapper.showMessage(form, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                            break;
                        default:
                            aWrapper.showMessage(form, 'danger', _result);
                    }
                }
            });
        },

        /* 25.08.2015 */
        ajaxPortlet: function (button, portlet, callback) {
            _Body.on('click', button, function (e) {
                e.preventDefault();
                aWrapper.blockPage();
                $.ajax({
                    url: $(this).attr('href'),
                    success: function (data) {
                        if (_FormPortlet) {
                            _FormPortlet.remove();
                        }
                        _FormPortlet = $(data);
                        _FormPortlet.insertAfter('[data-form="' + globalOptions.listPortlet + '"]');

                        if ($.isFunction(callback)) {
                            callback();
                        }

                        aWrapper.unblockPage();
                        aWrapper.showPortlet(portlet);
                    },
                    error: function (jqXHR) {
                        aWrapper.unblockPage();
                        var container = $(button).parents('.portlet').find('.portlet-body');

                        switch (jqXHR.status) {
                            case 403:
                                aWrapper.showMessage(container, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                                break;
                            default:
                                aWrapper.showMessage(container, 'danger', 'Помилка завантаження даних');
                        }
                    }
                });
            });
        },
        ajaxSubmit: function (form, portlet, callback) {
            aWrapper.blockPage();
            $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                data: form.serialize(),
                success: function (data) {
                    if (_FormPortlet) {
                        _FormPortlet.remove();
                    }
                    _FormPortlet = $(data);
                    _FormPortlet.insertAfter('[data-form="' + globalOptions.listPortlet + '"]');

                    if ($.isFunction(callback)) {
                        callback();
                    }

                    aWrapper.unblockPage();
                    aWrapper.showPortlet(portlet);
                },
                error: function (jqXHR) {
                    var _result = '';
                    try {
                        var _data = $.parseJSON(jqXHR.responseText);
                        _result = '<ul>';
                        $.each(_data, function (key, value) {
                            _result += '<li>' + value + '</li>';
                        });
                        _result += '</ul>';
                    } catch (message) {
                        _result = 'Помилка збереження даних';
                    }

                    aWrapper.unblockPage();
                    switch (jqXHR.status) {
                        case 403:
                            aWrapper.showMessage(form, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                            break;
                        default:
                            aWrapper.showMessage(form, 'danger', _result);
                    }
                }
            });
        },

        /* OLD */
        submitToList: function (form, callback) {
            aWrapper.blockPage();
            $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                data: form.serialize(),
                success: function () {
                    if (_FormPortlet) {
                        _FormPortlet.remove();
                    }
                    _FormPortlet = null;

                    if ($.isFunction(callback)) {
                        callback();
                    }

                    aWrapper.unblockPage();
                    aWrapper.showPortlet(globalOptions.listPortlet);
                },
                error: function (jqXHR) {
                    var _result = '';
                    try {
                        var _data = $.parseJSON(jqXHR.responseText);
                        _result = '<ul>';
                        $.each(_data, function (key, value) {
                            _result += '<li>' + value + '</li>';
                        });
                        _result += '</ul>';
                    } catch (message) {
                        _result = 'Помилка збереження даних';
                    }

                    aWrapper.unblockPage();
                    switch (jqXHR.status) {
                        case 403:
                            aWrapper.showMessage(form, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                            break;
                        default:
                            aWrapper.showMessage(form, 'danger', _result);
                    }
                }
            });
        },
        backToList: function (button) {
            _Body.on('click', button, function (e) {
                e.preventDefault();
                if (aWrapper.showPortlet(globalOptions.listPortlet)) {
                    if (_FormPortlet) {
                        _FormPortlet.remove();
                    }
                    _FormPortlet = null;
                }
            });
        },
        destroyItem: function (button, callback) {
            _Body.on('click', button, function (e) {
                e.preventDefault();
                if (confirm('Видалити?')) {
                    aWrapper.blockPage();
                    var link = $(this).attr('href');
                    $.ajax({
                        url: link,
                        method: 'POST',
                        data: {
                            '_token': _TOKEN
                        },
                        success: function () {
                            if ($.isFunction(callback)) {
                                callback();
                            }
                            aWrapper.unblockPage();
                        },
                        error: function (jqXHR) {
                            aWrapper.unblockPage();
                            var container = $(button).parents('.portlet').find('.portlet-body');

                            switch (jqXHR.status) {
                                case 403:
                                    aWrapper.showMessage(container, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                                    break;
                                default:
                                    aWrapper.showMessage(container, 'danger', 'Помилка видалення даних');
                            }
                        }
                    });
                } else return false;
            });
        },
        resourceDestroyItem: function (button, callback) {
            _Body.on('click', button, function (e) {
                e.preventDefault();
                var _button = this;
                if (confirm('Видалити?')) {
                    aWrapper.blockPage();
                    $.ajax({
                        url: $(this).attr('href'),
                        method: 'DELETE',
                        data: {
                            '_token': _TOKEN
                        },
                        success: function () {
                            if ($.isFunction(callback)) {
                                callback(_button);
                            }
                            aWrapper.unblockPage();
                        },
                        error: function (jqXHR) {
                            aWrapper.unblockPage();
                            var container = $(button).parents('.portlet').find('.portlet-body');

                            switch (jqXHR.status) {
                                case 403:
                                    aWrapper.showMessage(container, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                                    break;
                                default:
                                    aWrapper.showMessage(container, 'danger', 'Помилка видалення даних');
                            }
                        }
                    });
                } else return false;
            });
        },
        loadForm: function (button, callback) {
            _Body.on('click', button, function (e) {
                e.preventDefault();
                aWrapper.blockPage();
                var link = $(this).attr('href');
                $.ajax({
                    url: link,
                    success: function (data) {
                        if (_FormPortlet) {
                            _FormPortlet.remove();
                        }
                        _FormPortlet = $(data);
                        _FormPortlet.insertAfter('[data-form="' + globalOptions.listPortlet + '"]');

                        if ($.isFunction(callback)) {
                            callback();
                        }

                        aWrapper.unblockPage();
                        aWrapper.showPortlet(globalOptions.formPortlet);
                    },
                    error: function (jqXHR) {
                        aWrapper.unblockPage();
                        var container = $(button).parents('.portlet').find('.portlet-body');

                        switch (jqXHR.status) {
                            case 403:
                                aWrapper.showMessage(container, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                                break;
                            default:
                                aWrapper.showMessage(container, 'danger', 'Помилка завантаження даних');
                        }
                    }
                });
            });
        },
        loadTable: function (button, callback) {
            _Body.on('click', button, function (e) {
                e.preventDefault();
                aWrapper.blockPage();
                var link = $(this).attr('href');
                $.ajax({
                    url: link,
                    success: function (data) {
                        if (_FormPortlet) {
                            _FormPortlet.remove();
                        }
                        _FormPortlet = $(data);
                        _FormPortlet.insertAfter('[data-form="' + globalOptions.listPortlet + '"]');

                        if ($.isFunction(callback)) {
                            callback(link);
                        }

                        aWrapper.unblockPage();
                        aWrapper.showPortlet(globalOptions.tablePortlet);
                    },
                    error: function (jqXHR) {
                        aWrapper.unblockPage();
                        var container = $(button).parents('.portlet').find('.portlet-body');

                        switch (jqXHR.status) {
                            case 403:
                                aWrapper.showMessage(container, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                                break;
                            default:
                                aWrapper.showMessage(container, 'danger', 'Помилка завантаження даних');
                        }
                    }
                });
            });
        },
        submitModalForm: function (form, modal, callback) {
            $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                data: form.serialize(),
                success: function () {
                    $(modal).modal('hide');

                    if ($.isFunction(callback)) {
                        callback();
                    }
                },
                error: function (jqXHR) {
                    var _result = '';
                    try {
                        var _data = $.parseJSON(jqXHR.responseText);
                        _result = '<ul>';
                        $.each(_data, function (key, value) {
                            _result += '<li>' + value + '</li>';
                        });
                        _result += '</ul>';
                    } catch (message) {
                        _result = 'Помилка збереження даних';
                    }

                    switch (jqXHR.status) {
                        case 403:
                            aWrapper.showMessage(form, 'danger', 'Доступ заборонено. Зверніться до адміністратора');
                            break;
                        default:
                            aWrapper.showMessage(form, 'danger', _result);
                    }
                }
            });
        },
        loadModal: function (button, modal) {
            _Body.on('click', button, function (e) {
                e.preventDefault();
                $(modal).modal();
            });
        },

        transliterate: function (source) {
            var _Space = '-';
            var _Text = jQuery(source).val().toLowerCase();
            var _Result = '';
            var _Char = '';

            var _Matrix = {
                'й': 'i', 'ц': 'c', 'у': 'u', 'к': 'k', 'е': 'e', 'н': 'n',
                'г': 'g', 'ш': 'sh', 'щ': 'shch', 'з': 'z', 'х': 'h', 'ъ': '',
                'ф': 'f', 'ы': 'y', 'в': 'v', 'а': 'a', 'п': 'p', 'р': 'r',
                'о': 'o', 'л': 'l', 'д': 'd', 'ж': 'zh', 'э': 'e', 'ё': 'e',
                'я': 'ya', 'ч': 'ch', 'с': 's', 'м': 'm', 'и': 'i', 'т': 't',
                'ь': '', 'б': 'b', 'ю': 'yu', 'ү': 'u', 'қ': 'k', 'ғ': 'g',
                'ә': 'e', 'ң': 'n', 'ұ': 'u', 'ө': 'o', 'Һ': 'h', 'һ': 'h',
                'і': 'i', 'ї': 'ji', 'є': 'je', 'ґ': 'g',
                'Й': 'I', 'Ц': 'C', 'У': 'U', 'Ұ': 'U', 'Ө': 'O', 'К': 'K',
                'Е': 'E', 'Н': 'N', 'Г': 'G', 'Ш': 'SH', 'Ә': 'E', 'Ң ': 'N',
                'З': 'Z', 'Х': 'H', 'Ъ': '', 'Ф': 'F', 'Ы': 'Y', 'В': 'V',
                'А': 'A', 'П': 'P', 'Р': 'R', 'О': 'O', 'Л': 'L', 'Д': 'D',
                'Ж': 'ZH', 'Э': 'E', 'Ё': 'E', 'Я': 'YA', 'Ч': 'CH', 'С': 'S',
                'М': 'M', 'И': 'I', 'Т': 'T', 'Ь': '', 'Б': 'B', 'Ю': 'YU',
                'Ү': 'U', 'Қ': 'K', 'Ғ': 'G', 'Щ': 'SHCH', 'І': 'I', 'Ї': 'YI',
                'Є': 'YE', 'Ґ': 'G',
                ' ': _Space, '_': _Space, '`': _Space, '~': _Space, '!': _Space, '@': _Space,
                '#': _Space, '$': _Space, '%': _Space, '^': _Space, '&': _Space, '*': _Space,
                '(': _Space, ')': _Space, '-': _Space, '=': _Space, '+': _Space, '[': _Space,
                ']': _Space, '\\': _Space, '|': _Space, '/': _Space, '.': _Space, ',': _Space,
                '{': _Space, '}': _Space, '\'': _Space, '"': _Space, ';': _Space, ':': _Space,
                '?': _Space, '<': _Space, '>': _Space, '№': _Space
            };

            for (var i = 0; i < _Text.length; i++) {
                if (_Matrix[_Text[i]] != undefined) {
                    if (_Char != _Matrix[_Text[i]] || _Char != _Space) {
                        _Result += _Matrix[_Text[i]];
                        _Char = _Matrix[_Text[i]];
                    }
                } else {
                    _Result += _Text[i];
                    _Char = _Text[i];
                }
            }

            _Result = jQuery.trim(_Result);

            return _Result;
        },
        datePicker: function (element, options) {
            options = $.extend(true, {
                autoclose: true,
                language: 'ua',
                todayHighlight: true,
                format: 'dd.mm.yyyy'
            }, options);

            element.datepicker(options);
        },
        dateTimePicker: function (element, options) {
            options = $.extend(true, {
                autoclose: true,
                language: 'ua',
                todayHighlight: true,
                todayBtn: true,
                format: 'dd.mm.yyyy',
                pickerPosition: 'bottom-left'
            }, options);

            element.datetimepicker(options);
        },
        tinyMCE: function (element, options) {
            options = $.extend(true, {
                theme: 'modern',
                plugins: 'image, link, code, pagebreak, table, lists',
                pagebreak_separator: '<hr id="system-readmore" />',
                toolbar: [
                    'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image table | link unlink | styleselect | code pagebreak'
                ],
                toolbar_items_size: 'small',
                menubar: false,
                statusbar: false,
                height: '300px',
                language: 'uk_UA'
            }, options);

            element.tinymce(options);
        },
        uniform: function () {
            Metronic.initUniform("input[type=checkbox]:not(.toggle, .make-switch), input[type=radio]:not(.toggle, .star, .make-switch)");
        },
        select2: function (element) {
            element.select2();
        },
        blockPage: function () {
            Metronic.blockUI({
                boxed: true,
                message: 'Завантаження...'
            });
        },
        unblockPage: function () {
            Metronic.unblockUI();
        },
        blockBox: function (target) {
            Metronic.blockUI({
                target: target,
                boxed: true,
                message: 'Завантаження...'
            });
        },
        unblockBox: function (target) {
            Metronic.unblockUI(target);
        },
        showPortlet: function (portlet) {
            $('[data-form]').removeClass('show');
            return $('[data-form="' + portlet + '"]').addClass('show').length > 0;
        },
        showMessage: function (m_container, m_type, m_text, m_icon) {
            Metronic.alert({
                container: m_container,
                place: 'prepend',
                type: m_type,
                message: m_text,
                close: 1,
                reset: 1,
                focus: 1,
                closeInSeconds: 10,
                icon: m_icon
            });
        }
    }
};