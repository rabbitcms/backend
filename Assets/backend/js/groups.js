define(["require", "exports", "jquery", "rabbitcms/backend", "rabbitcms/datatable", "rabbitcms/form"], function (require, exports, $, backend_1, datatable_1, form_1) {
    "use strict";
    var Groups = (function (_super) {
        __extends(Groups, _super);
        function Groups() {
            _super.apply(this, arguments);
        }
        Groups.prototype.table = function (portlet) {
            var dataTable = new datatable_1.DataTable({
                src: $('.data-table', portlet),
                dataTable: {
                    ordering: false
                }
            });
            this.bind('updated', function () {
                dataTable.submitFilter();
            });
            portlet.on('click', '[rel="destroy"]', function (e) {
                e.preventDefault();
                backend_1.Dialogs.onDelete({
                    url: $(e.currentTarget).attr('href')
                }).then(function () { return dataTable.submitFilter(); });
            });
        };
        Groups.prototype.form = function (portlet, state) {
            var _this = this;
            var $form = $('form', portlet);
            new form_1.Form($form, {
                state: state,
                validation: {
                    rules: { "groups[caption]": { required: true } }
                },
                completeSubmit: function () {
                    _this.trigger('updated');
                }
            });
            if ($form.data('type') == 'update') {
                var dataTable_1 = new datatable_1.DataTable({
                    src: $('.data-table', portlet)
                });
                portlet.on('click', '[rel="destroy"]', function (e) {
                    e.preventDefault();
                    backend_1.Dialogs.onDelete({
                        url: $(e.currentTarget).attr('href'),
                        method: 'POST'
                    }).then(function () { return dataTable_1.submitFilter(); });
                });
            }
        };
        return Groups;
    }(backend_1.MicroEvent));
    return new Groups();
});
//# sourceMappingURL=groups.js.map