define(['jquery'], function ($) {
    return function ($form, ajax) {
        return new Promise((resolve, reject) => {
            let lock = false, validator = $form.validate({
                ignore: '',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorPlacement: function (error, element) {
                    var group = element.closest('.input-group');
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
                                    $form.blockUI();
                                    lock = true;
                                },
                                complete: function () {
                                    $form.unblockUI();
                                    lock = false;
                                },
                                success: function (data) {
                                    resolve(data);
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
                                        reject(response.responseJSON);
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
        });
    }
});