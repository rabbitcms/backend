define(["require", "exports", "jquery", "rabbitcms/backend", "rabbitcms/datatable", "rabbitcms/form"], function (require, exports, $, backend_1, datatable_1, form_1) {
    "use strict";
    var Groups = (function (_super) {
        __extends(Groups, _super);
        function Groups() {
            _super.apply(this, arguments);
        }
        Groups.prototype.table = function (portlet) {
            var dataTable = new datatable_1.DataTable({
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
            portlet.on('click', '[rel="delete"]', function (e) {
                e.preventDefault();
                backend_1.Dialogs.onDelete({
                    url: $(e.currentTarget).attr('href'),
                    method: 'POST'
                }).then(function () { return dataTable.submitFilter(); });
            });
        };
        Groups.prototype.form = function (portlet, state) {
            var _this = this;
            var form = $('form', portlet);
            new form_1.Form(form, {
                state: state,
                validation: {
                    rules: { "groups[caption]": { required: true } }
                },
                completeSubmit: function () {
                    _this.trigger('dt.update');
                }
            });
            if (form.data('type') == 'update') {
                var dataTable_1 = new datatable_1.DataTable({
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
                portlet.on('click', '[rel="delete"]', function (e) {
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