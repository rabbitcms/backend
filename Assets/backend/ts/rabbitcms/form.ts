/**
 * Created by lnkvisitor on 01.08.16.
 */
import * as $ from 'jquery';
import {RabbitCMS, State, ValidationOptions} from "rabbitcms/backend";
import * as i18n from "i18n!rabbitcms/nls/backend";

export interface FormOptions {
    validation?:ValidationOptions;
    ajax?:DataTables.AjaxSettings|boolean;
    completeSubmit:()=>void;
    state?:State;
    dialog?:BootboxDialogOptions|boolean
}

export class Form {
    private options:FormOptions;
    private form:JQuery;
    private data:string;
    private match:boolean = false;

    constructor(form:JQuery, options?:FormOptions) {
        this.form = form;
        this.options = $.extend(true, {
            validate: null,
            completeSubmit: ()=> {
            }
        }, options);

        if (this.options.state && this.options.dialog !== false) {
            this.options.state.addChecker((replay:()=>void)=>new Promise<void>((resolve, reject)=> {
                if (!this.match && this.data !== this.getData()) {
                    require(['bootbox'], (bootbox:BootboxStatic)=> {
                        let dialog:BootboxDialogOptions = <BootboxDialogOptions>$.extend(true, <BootboxDialogOptions>{
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
            form.on('submit', ()=> {
                this.submitForm();
            });
        }
        this.syncOriginal();
    }

    syncOriginal() {
        this.data = this.getData();
    }

    getData():string {
        return $('input:not(.ignore-scan),select:not(.ignore-scan),textarea:not(.ignore-scan)', this.form).serialize();
    }

    submitForm() {
        this.syncOriginal();
        if (this.options.ajax !== false) {
            RabbitCMS.ajax({
                url: this.form.attr('action'),
                method: this.form.attr('method'),
                data: this.data,
                success: ()=> {
                    if (!this.options.completeSubmit()) {
                        history.back();
                    }
                }
            });
        } else {
            (<HTMLFormElement>this.form[0]).submit();
            this.options.completeSubmit();
        }
    }
}