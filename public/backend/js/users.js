define(["require", "exports", "jquery", "rabbitcms/backend", "rabbitcms/datatable", "rabbitcms/form"], function (require, exports, $, backend_1, datatable_1, form_1) {
    "use strict";
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        User.prototype.table = function (portlet) {
            var dataTable = new datatable_1.DataTable({
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
        User.prototype.form = function (portlet, state) {
            var _this = this;
            var form = $('form', portlet);
            var select2 = $('.select2', form);
            backend_1.RabbitCMS.select2(select2);
            new form_1.Form(form, {
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
                completeSubmit: function () {
                    _this.trigger('dt.update');
                }
            });
        };
        return User;
    }(backend_1.MicroEvent));
    return new User();
});
//# sourceMappingURL=users.js.map