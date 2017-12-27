define(['jquery'], function ($) {
    function check($form, check) {
        return $form.data('form').split(/\s+/).includes(check);
    }

    return function ($form, ajax, callback) {
        callback = callback || (() => undefined);
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
});