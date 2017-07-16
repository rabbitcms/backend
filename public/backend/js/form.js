define(["require", "exports", "jquery", "rabbitcms/backend", "i18n!rabbitcms/nls/backend"], function (require, exports, $, backend_1, i18n) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Form = (function () {
        function Form(form, options) {
            var _this = this;
            this.match = false;
            this.form = form;
            this.options = $.extend(true, {
                validate: null,
                completeSubmit: function () {
                },
                canSubmit: function () {
                    return true;
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
                        onfocusout: function (element) {
                            $(element).closest('.form-group').removeClass('has-error')
                                .find('.help-block').remove();
                        },
                        submitHandler: function () {
                            _this.submitForm();
                        }
                    }, _this.options.validation);
                    form.validate(options);
                });
            }
            else {
                form.on('submit', function (e) {
                    e.preventDefault();
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
            if (this.options.canSubmit() === false) {
                return;
            }
            this.syncOriginal();
            if (this.options.ajax !== false) {
                var options = $.extend(true, {
                    warningTarget: this.form.find('.form-body:first'),
                    blockTarget: this.form,
                    url: this.form.attr('action'),
                    method: this.form.attr('method'),
                    data: this.data,
                    success: function (data) {
                        if (!_this.options.completeSubmit(data)) {
                            history.back();
                        }
                    },
                    error: function (jqXHR) {
                        var form = _this.form;
                        var errorPlacement = form.data('error-placement');
                        if (errorPlacement === 'inline') {
                            $('.error-block', form).remove();
                            if (jqXHR.status === 422) {
                                $.each(jqXHR.responseJSON, function (key, values) {
                                    var nKey = key.split('.');
                                    var key2 = '';
                                    if (nKey.length > 1) {
                                        for (var i = 0; i < nKey.length; i++) {
                                            if (i === 0) {
                                                key2 += nKey[i];
                                            }
                                            else {
                                                key2 += '[' + nKey[i] + ']';
                                            }
                                        }
                                    }
                                    else {
                                        key2 = nKey[0];
                                    }
                                    var element = $('[name="' + key2 + '"]', form);
                                    var container = element.parents('.input-group-lg');
                                    element = container.length ? container : element;
                                    var helpBlock = element.siblings('div.error-block').length
                                        ? element.siblings('div.error-block').first()
                                        : $('<div class="help-block error-block"></div>');
                                    if (!element.siblings('div.error-block').length) {
                                        element.parent().append(helpBlock);
                                    }
                                    element.closest('.form-group')
                                        .addClass('has-error');
                                    helpBlock.text(values[0]);
                                });
                            }
                        }
                        else {
                            var responseText_1 = '<ul class="list-unstyled">';
                            if (jqXHR.status === 422) {
                                $.each(jqXHR.responseJSON, function (key, values) {
                                    responseText_1 += '<li>' + values[0] + '</li>';
                                });
                            }
                            else {
                                responseText_1 += '<li>' + jqXHR.responseText + '</li>';
                            }
                            responseText_1 += '</ul>';
                            backend_1.RabbitCMS.customMessage(responseText_1, 'danger', _this.form.find('.form-body:first'));
                        }
                    }
                }, this.options.ajax);
                backend_1.RabbitCMS.ajax(options);
            }
            else {
                this.form[0].submit();
                this.options.completeSubmit();
            }
        };
        return Form;
    }());
    exports.Form = Form;
});
//# sourceMappingURL=form.js.map