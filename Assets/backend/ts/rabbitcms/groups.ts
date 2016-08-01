import * as $ from "jquery";
import {MicroEvent, State, Dialogs} from "rabbitcms/backend";
import {DataTable} from "rabbitcms/datatable";
import {Form} from "Assets/backend/ts/rabbitcms/form";

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
            Dialogs.onDelete({
                url: $(e.currentTarget).attr('href')
            }).then(()=> dataTable.submitFilter());
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

        if ($form.data('type') == 'update') {
            let dataTable = new DataTable({
                src: $('.data-table', portlet)
            });

            portlet.on('click', '[rel="destroy"]', (e:JQueryEventObject)=> {
                e.preventDefault();
                Dialogs.onDelete({
                    url: $(e.currentTarget).attr('href'),
                    method: 'POST'
                }).then(()=> dataTable.submitFilter());
            });
        }
    }
}

export = <{table(portlet:JQuery),form(portlet:JQuery, state:State)}>new Groups();