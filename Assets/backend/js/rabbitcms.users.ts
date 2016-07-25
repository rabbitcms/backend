import * as $ from "jquery";
import "jquery.validation";
import {MicroEvent, RabbitCMS} from "rabbitcms.backend";
import {DataTable} from "rabbitcms.datatable";

class User extends MicroEvent {

    table(portlet:JQuery) {
        var dataTable = new DataTable();
        var tableSelector = $('.data-table', portlet);
        if (tableSelector.data('init') === true) {
            return;
        }
        tableSelector.data('init', true);


        dataTable.setAjaxParam('_token', RabbitCMS.getToken());
        dataTable.init({
            src: tableSelector,
            dataTable: {
                ajax: {
                    url: tableSelector.data('link')
                },
                ordering: false
            }
        });

        tableSelector.on('change', '.form-filter', () => {
            dataTable.submitFilter();
        });

        this.bind('users.updated', () => {
            dataTable.getDataTable().ajax.reload();
        });

        portlet.on('click', '[rel="destroy"]', (e:JQueryEventObject) => {
            var link = $(e.target).attr('href');

            RabbitCMS.Dialogs.onDelete(link, () => {
                dataTable.getDataTable().ajax.reload();
            });

            return false;
        });
    }

    form(portlet:JQuery) {
        var form = $('form', portlet);
        var _validationRules = {};

        RabbitCMS.select2($('.select2'));

        if (form.data('type') === 'update') {
            _validationRules = {
                "user[email]": {
                    required: true,
                    email: true
                },
                "groups[]": {
                    required: true
                }
            }
        } else {
            _validationRules = {
                "user[email]": {
                    required: true,
                    email: true
                },
                "password": {
                    required: true
                },
                "groups[]": {
                    required: true
                }
            }
        }

        form.validate({
            focusInvalid: true,
            rules: _validationRules,
            highlight: (element:HTMLElement) => {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: (element:HTMLElement) => {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorPlacement: (error, element) => {

            },
            submitHandler: (form:HTMLFormElement) => {
                RabbitCMS.submitForm(form, () => {
                    this.trigger('users.updated');
                });
            }
        });
    }
}


export = new User();
