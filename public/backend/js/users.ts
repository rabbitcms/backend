import * as $ from "jquery";
import {MicroEvent, RabbitCMS, State, Dialogs} from "rabbitcms/backend";
import {DataTable} from "rabbitcms/datatable";
import {Form} from "rabbitcms/form";

class User extends MicroEvent {

    table(portlet: JQuery) {
        let dataTable = new DataTable({
            src: $('#backend_users_table', portlet),
            dataTable: {
                ordering: false,
                columnDefs: [
                    {
                        targets: 4,
                        render: function (data, type, row, meta) {
                            return '<a class="btn btn-sm green" href="' + row.actions.edit + '"><i class="fa fa-pencil"></i></a> ' +
                                '<a class="btn btn-sm red" href="' + row.actions.delete + '" rel="delete"><i class="fa fa-trash-o"></i></a> ';
                        }
                    }
                ]
            }
        });

        this.bind('dt.update', () => {
            dataTable.submitFilter();
        });

        portlet.on('click', '[rel="delete"]', (e: JQueryEventObject) => {
            e.preventDefault();

            Dialogs.onDelete({
                url: $(e.currentTarget).attr('href'),
                method: 'POST'
            }).then(() => dataTable.submitFilter());
        });
    }

    form(portlet: JQuery, state: State) {
        let form = $('form', portlet);

        let select2 = $('.select2', form);
        RabbitCMS.select2(select2);

        new Form(form, {
            state: state,
            validation: {
                rules: {
                    "email": {
                        required: true,
                        email: true
                    },
                    "groups[]": {
                        required: true
                    }
                },
            },
            completeSubmit: () => {
                this.trigger('dt.update');
            }
        });
    }
}

export = <{table(portlet: JQuery),form(portlet: JQuery, state: State)}>new User();