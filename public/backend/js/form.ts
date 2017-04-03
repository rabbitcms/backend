/**
 * Created by lnkvisitor on 01.08.16.
 */
import * as $ from 'jquery';
import {RabbitCMS, State, ValidationOptions, AjaxSettings} from "rabbitcms/backend";
import * as i18n from "i18n!rabbitcms/nls/backend";

export interface FormOptions {
    validation?: ValidationOptions;
    ajax?: AjaxSettings|boolean;
    completeSubmit: (data?: any)=>void;
    canSubmit?: ()=>boolean;
    state?: State;
    dialog?: BootboxDialogOptions|boolean
}

export class Form {
    private options: FormOptions;
    private form: JQuery;
    private data: string;
    private match: boolean = false;

    constructor(form: JQuery, options?: FormOptions) {
        this.form = form;
        this.options = $.extend(true, {
            validate: null,
            completeSubmit: ()=> {
            },
            canSubmit: ()=> {
                return true;
            }
        }, options);

        if (this.options.state && this.options.dialog !== false) {
            this.options.state.addChecker((replay: ()=>void)=>new Promise<void>((resolve, reject)=> {
                if (!this.match && this.data !== this.getData()) {
                    require(['bootbox'], (bootbox: BootboxStatic)=> {
                        let dialog: BootboxDialogOptions = <BootboxDialogOptions>$.extend(true, <BootboxDialogOptions>{
                            message: '<h4>' + i18n.dataHasBeenModified + '</h4>',
                            closeButton: false,
                            buttons: {
                                save: {
                                    label: i18n.save,
                                    className: 'btn-sm btn-success btn-green',
                                    callback: ()=> {
                                        this.form.submit();
                                    }
                                },
                                cancel: {
                                    label: i18n.dontSave,
                                    className: 'btn-sm btn-danger',
                                    callback: () => {
                                        this.match = true;
                                        (replay || function () {
                                        })();
                                    }
                                },
                                close: {
                                    label: i18n.close,
                                    className: 'btn-sm'
                                }
                            }
                        }, this.options.dialog);
                        bootbox.dialog(dialog);
                    });
                    reject();
                } else {
                    this.match = false;
                    resolve();
                }
            }));
        }

        if (this.options.validation !== false) {
            require(['rabbitcms/loader/validation'], ()=> {
                let options = $.extend(true, {
                    submitHandler: () => {
                        this.submitForm();
                    }
                }, this.options.validation);
                form.validate(options);
            });
        } else {
            form.on('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }
        this.syncOriginal();
    }

    syncOriginal() {
        this.data = this.getData();
    }

    getData(): string {
        return $('input:not(.ignore-scan),select:not(.ignore-scan),textarea:not(.ignore-scan)', this.form).serialize();
    }


    submitForm() {
        if (this.options.canSubmit() === false) {
            return;
        }
        this.syncOriginal();
        if (this.options.ajax !== false) {
            let options = $.extend(true, {
                warningTarget: this.form.find('.form-body:first'),
                blockTarget: this.form,
                url: this.form.attr('action'),
                method: this.form.attr('method'),
                data: this.data,
                success: (data) => {
                    if (!this.options.completeSubmit(data)) {
                        history.back();
                    }
                },
                error: (jqXHR: JQueryXHR) => {
                    let form = this.form;
                    let error_placement = form.data('error-placement');

                    let errors = {};
                    if (jqXHR.status === 422) {
                        $.each(jqXHR.responseJSON, function (key, values) {
                            errors[key] = values[0];
                        });
                    } else {
                        errors[0] = jqXHR.responseText;
                    }

                    if (error_placement === 'inline') {
                        $('.error-block', form).remove();

                        $.each(errors, function (key, value) {
                            let element = $('[name="' + key + '"]', form);
                            let help_block = element.siblings('div.error-block').length
                                ? element.siblings('div.error-block').first()
                                : $('<div class="help-block error-block"></div>');

                            if (!element.siblings('div.error-block').length) {
                                element.parent().append(help_block);
                            }

                            console.log(key, element.siblings('div.help-block'));

                            element.closest('.form-group')
                                .addClass('has-error');

                            help_block.text(value);
                        });
                    } else {
                        let responseText = '<ul class="list-unstyled">';

                        $.each(errors, function (key, value) {
                            responseText += '<li>' + value + '</li>'
                        });

                        responseText += '</ul>';

                        RabbitCMS.customMessage(responseText, 'danger', this.form.find('.form-body:first'));
                    }
                }
            }, this.options.ajax);

            RabbitCMS.ajax(options);
        } else {
            (<HTMLFormElement>this.form[0]).submit();
            this.options.completeSubmit();
        }
    }
}