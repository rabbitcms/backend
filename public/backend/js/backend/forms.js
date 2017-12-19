define(['jquery'], function ($) {
    return function ($form, ajax, callback) {
        callback = callback || function () {};
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
                        if (ajax !== false) {
                            $.ajax($.extend(true, {
                                method: $form.attr('method'),
                                url: $form.attr('action'),
                                data: $form.serialize(),
                                beforeSend: function () {
                                    $form.block();
                                    lock = true;
                                },
                                complete: function () {
                                    $form.unblock();
                                    lock = false;
                                },
                                success: function (data) {
                                    callback(null, data);
                                },
                                error: function (response) {
                                    lock = false;
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
                                    contentType: false,
                                }
                                : {}));
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