define(['jquery'], function ($) {
    function check($form, check) {
        let data = $form.data('form');
        return data && data.split(/\s+/).includes(check);
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
                                    callback(null, data);
                                },
                                error: function (response) {
                                    lock = false;
                                    RabbitCMS.unblockUI($form);
                                    if (response.status === 422) {
                                        let rawErrors = response.responseJSON.errors;
                                        validator.showErrors(Object.keys(rawErrors).reduce(function (errors, key) {
                                            errors[key.split('.').map(function (value, index) {
                                                return index === 0 ? value : '[' + value + ']';
                                            }).join('')] = rawErrors[key][0];
                                            return errors;
                                        }, {}));
                                    } else {
                                        callback(response.responseJSON);
                                    }
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
        let $select = $(select),
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
        update();
    };

    return forms;
});