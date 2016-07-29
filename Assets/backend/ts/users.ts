import * as $ from "jquery";
import {MicroEvent, State, Form, Dialogs} from "rabbitcms/backend";
import {DataTable} from "rabbitcms/datatable";

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
            Dialogs.onDelete({
                url: $(e.target).attr('href')
            }).then(()=>dataTable.submitFilter());
        });
    }

    /**
     * Initialize user form.
     * @param {JQuery} portlet
     * @param {State} state
     */
    form(portlet:JQuery, state:State) {
        let $form = $('form', portlet);
        let _validationRules = {
            "user[email]": {required: true, email: true},
            "groups[]": {required: true}
        };

        if ($form.data('type') !== 'update') {
            _validationRules["password"] = {required: true};
        }

        new Form($form, {
            state: state,
            validation: {
                rules: _validationRules,
            },
            completeSubmit: ()=> {
                this.trigger('updated');
            },
        });
    }
}

export = new User();