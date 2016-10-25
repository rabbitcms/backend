import * as $ from "jquery";
import {MicroEvent, State, Dialogs} from "rabbitcms/backend";
import {DataTable} from "rabbitcms/datatable";
import {Form} from "rabbitcms/form";

class Groups extends MicroEvent {

    table(portlet: JQuery) {
        var dataTable = new DataTable({
            src: $('#backend_groups_table', portlet),
            dataTable: {
                ordering: false,
                columnDefs: [
                    {
                        targets: 2,
                        render: function (data, type, row, meta) {
                            return '<a class="btn btn-sm green" href="' + row.actions.edit + '"><i class="fa fa-pencil"></i></a> ' +
                                '<a class="btn btn-sm red" href="' + row.actions.delete + '" rel="delete"><i class="fa fa-trash-o"></i></a> ';
                        }
                    }
                ]
            }
        });

        this.bind('dt.update', function () {
            dataTable.submitFilter();
        });

        portlet.on('click', '[rel="delete"]', (e: JQueryEventObject)=> {
            e.preventDefault();

            Dialogs.onDelete({
                url: $(e.currentTarget).attr('href'),
                method: 'POST'
            }).then(() => dataTable.submitFilter());
        });
    }

    form(portlet: JQuery, state: State) {
        var form = $('form', portlet);

        new Form(form, {
            state: state,
            validation: {
                rules: {"groups[caption]": {required: true}}
            },
            completeSubmit: () => {
                this.trigger('dt.update');
            }
        });

        if (form.data('type') == 'update') {
            let dataTable = new DataTable({
                src: $('#backend_groups_users_table', portlet),
                dataTable: {
                    ordering: false,
                    columnDefs: [
                        {
                            targets: 2,
                            render: function (data, type, row, meta) {
                                return '<a class="btn btn-sm red" href="' + row.actions.delete + '" rel="delete"><i class="fa fa-trash-o"></i></a> ';
                            }
                        }
                    ]
                }
            });

            portlet.on('click', '[rel="delete"]', (e: JQueryEventObject)=> {
                e.preventDefault();

                Dialogs.onDelete({
                    url: $(e.currentTarget).attr('href'),
                    method: 'POST'
                }).then(() => dataTable.submitFilter());
            });
        }
    }
}

export = <{table(portlet: JQuery),form(portlet: JQuery, state: State)}>new Groups();