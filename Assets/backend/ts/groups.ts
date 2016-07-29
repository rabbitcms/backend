import * as $ from "jquery";
import {MicroEvent, RabbitCMS, Form, State} from "rabbitcms/backend";
import {DataTable} from "rabbitcms/datatable";

class Groups extends MicroEvent {
    table(portlet:JQuery) {
        var dataTable = new DataTable({
            src: $('.data-table', portlet),
            dataTable: {
                ordering: false
            }
        });

        this.bind('updated', function () {
            dataTable.submitFilter();
        });

        portlet.on('click', '[rel="destroy"]', (e:JQueryEventObject)=> {
            e.preventDefault();
            RabbitCMS.Dialogs.onDelete($(e.target).attr('href'), ()=> {
                dataTable.submitFilter();
            });
        });
    }

    form(portlet:JQuery, state:State) {
        var $form = $('form', portlet);

        new Form($form, {
            state: state,
            validation: {
                rules: {"groups[caption]": {required: true}}
            },
            completeSubmit: ()=> {
                this.trigger('updated');
            }
        });

        portlet.on('change', '.write-rule', function () {
            if ($(this).is(':checked')) {
                $(this).parents('tr').find('.read-rule').prop('checked', true);
            }
        });

        portlet.on('change', '.read-rule', function () {
            var _write = $(this).parents('tr').find('.write-rule');
            if (_write.is(':checked')) {
                $(this).prop('checked', true);
            }
        });

        portlet.on('change', '.module-read-rule', function () {
            var _module = $(this).data('module');
            var _write = $(this).parents('tr').find('.module-write-rule');

            if (_write.is(':checked')) {
                $(this).prop('checked', true);
            }

            $('.' + _module + '.read-rule').prop('checked', $(this).prop('checked')).trigger('change');

        });

        portlet.on('change', '.module-write-rule', function () {
            var _module = $(this).data('module');
            if ($(this).is(':checked')) {
                $(this).parents('tr').find('.module-read-rule').prop('checked', true);
            }

            $('.' + _module + '.write-rule').prop('checked', $(this).prop('checked')).trigger('change');

        });

        if ($form.data('type') == 'update') {
            let dataTable = new DataTable({
                src: $('.data-table', portlet),
                dataTable: {
                    ordering: false
                }
            });

            portlet.on('click', '[rel="destroy"]', (e:JQueryEventObject)=> {
                e.preventDefault();
                RabbitCMS.Dialogs.onDelete($(e.target).attr('href'), ()=> {
                    dataTable.submitFilter();
                });
            });
        }
    }
}

export = new Groups();