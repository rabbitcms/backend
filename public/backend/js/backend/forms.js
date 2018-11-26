define(['jquery'], function ($) {
    //Ukrainian phone number.
    $.validator.addMethod("phoneUA", function (a, b) {
        a = a.replace(/(?!^\+)\D/g, "");
        return this.optional(b) || a.length > 8 && a.match(/^(\+?380|0)?[345679]\d\d{3}\d{2}\d{2}$/)
    });

    let language = $('html').prop('lang');
    $.extend($.validator.messages, {
        'phoneUA': language === 'ru'
            ? 'Пожалуйста, введите правильный номер телефона.'
            : 'Будь ласка, введіть правильний номер телефону.',
        'notEqualTo': language === 'ru'
            ? 'Пожалуйста, введите другое значение.'
            : 'Будь ласка, введіть інше значення.'
    });

    function check($form, check) {
        let data = $form.data('form');
        return data && data.split(/\s+/).includes(check);
    }

    function find(object, str, def) {
        return object && object.hasOwnProperty(str) ? object[str] : def
    }

    function forms($form, ajax, callback) {
        callback = callback || (() => undefined);
        if (ajax instanceof Function) {
            callback = ajax;
            ajax = false;
        }
        let lock = false,
            validator = $form.validate({
                ignore: '',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorPlacement: function (error, element) {
                    let group = element.closest('.input-group');
                    error.insertAfter(group.length ? group : element);
                },
                submitHandler: function (form) {
                    if (lock) return;
                    try {
                        if (check($form, 'ajax') || ajax !== false) {
                            $.ajax($.extend(true, {
                                method: $form.attr('method'),
                                url: $form.attr('action'),
                                beforeSend: function () {
                                    lock = true;
                                    RabbitCMS.blockUI($form);
                                },
                                success: function (data) {
                                    lock = false;
                                    RabbitCMS.unblockUI($form);
                                    if (check($form, 'hide')) {
                                        $form.closest('.modal').modal('hide');
                                    }
                                    if (check($form, 'reset')) {
                                        form.reset();
                                    }
                                    if (check($form, 'back') && history.state !== null) {
                                        history.back();
                                    }
                                    if (check($form, 'redirect')) {
                                        setTimeout(() => {
                                            RabbitCMS.navigate(data.location);
                                        }, 300);
                                    }
                                    callback(null, data);
                                },
                                error: function (response) {
                                    lock = false;
                                    RabbitCMS.unblockUI($form);
                                    if (response.status === 422) {
                                        let rawErrors = response.responseJSON.errors;
                                        try {
                                            validator.showErrors(Object.keys(rawErrors).reduce(function (errors, key) {
                                                errors[key.split('.').map(function (value, index) {
                                                    return index === 0 ? value : '[' + value + ']';
                                                }).join('')] = rawErrors[key][0];
                                                return errors;
                                            }, {}));
                                        } catch (e) {
                                        }
                                    } else if (response.status === 418) {
                                        RabbitCMS.message({
                                            type: response.responseJSON.type,
                                            message: response.responseJSON.message
                                        });
                                    }
                                    callback(response.responseJSON);
                                }
                            }, $form.attr('enctype') === 'multipart/form-data'
                                ? {
                                    data: new FormData(form),
                                    processData: false,
                                    contentType: false
                                }
                                : {
                                    data: $form.serialize()
                                }));
                        } else {
                            form.submit();
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
    }

    forms.depend = function depend(select) {
        $(select).each(function (i,el) {
            let $select = $(el),
                $depend = $($select.data('depends')),
                options = $('[data-depends-id]', $select),
                update = function () {
                    let value = $depend.val();
                    options.detach().each(function (idx, option) {
                        let $option = $(option);
                        if ($option.data('dependsId') == value) {
                            $select.append($option);
                        }
                    });
                };

            $depend.on('change', update);
            $depend && update();
        });
    };

    forms.delete = (options) => new Promise((resolve, reject) => {
        require('bootbox').dialog({
            message: '<h4>Ви впевнені, що хочете видалити цей запис?</h4>',
            closeButton: false,
            buttons: {
                yes: {
                    label: 'Так',
                    className: 'btn-sm green',
                    callback: () => resolve(RabbitCMS._ajax(options))
                },
                no: {
                    label: 'Ні',
                    className: 'btn-sm red',
                    callback: () => reject()
                }
            }
        });
    });

    forms.fill = (form, data) => {
        form.find('input[name],textarea[name],select[name]').each((idx, el) => {
            let $el = $(el),
                matches = $el.attr('name').match(/^(.*?)(\[(.*)\])?$/),
                val = find(data, matches[1]);
            if (matches[3]) {
                val = find(val, matches[3]);
            }
            switch ($el.attr('type')) {
                case 'checkbox':
                    $el.prop('checked', !!val);
                    break;
                case 'radio':
                    if ($el.attr('value') == val)
                        $el.prop('checked', true);
                    break;
                default:
                    if (typeof(val) === typeof(true)) {
                        $el.val(val ? '1' : '0');
                    } else {
                        $el.val(val);
                    }
            }
        });
    };

    return forms;
});