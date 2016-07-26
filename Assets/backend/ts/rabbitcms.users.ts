import * as $ from "jquery";
import {MicroEvent, RabbitCMS} from "rabbitcms.backend";
import {DataTable} from "rabbitcms.datatable";

class User extends MicroEvent {
    /**
     * User table handler.
     * @param {JQuery} portlet
     */
    table(portlet:JQuery) {
        let dataTable = new DataTable({
            src: $('.data-table', portlet),
            dataTable: {
                ordering: false
            }
        });

        this.bind('updated', () => {
            dataTable.submitFilter();
        });

        portlet.on('click', '[rel="destroy"]', (e:JQueryEventObject) => {
            e.preventDefault();
            RabbitCMS.Dialogs.onDelete($(e.target).attr('href'), () => {
                dataTable.submitFilter();
            });
        });
    }

    /**
     * Initialize user form.
     * @param {JQuery} portlet
     */
    form(portlet:JQuery) {
        let $form = $('form', portlet);
        let _validationRules = {
            "user[email]": {required: true, email: true},
            "groups[]": {required: true}
        };

        RabbitCMS.select2($('.select2', portlet));

        if ($form.data('type') !== 'update') {
            _validationRules["password"] = {required: true};
        }

        RabbitCMS.validate($form, {
            rules: _validationRules,
            completeSubmit: ()=> {
                this.trigger('updated');
            },
        });
    }
}

export = new User();