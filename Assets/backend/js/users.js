define(["require", "exports", "jquery", "rabbitcms/backend", "rabbitcms/datatable", "rabbitcms/form"], function (require, exports, $, backend_1, datatable_1, form_1) {
    "use strict";
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            _super.apply(this, arguments);
        }
        User.prototype.table = function (portlet) {
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
                    url: $(e.target).attr('href')
                }).then(function () { return dataTable.submitFilter(); });
            });
        };
        User.prototype.form = function (portlet, state) {
            var _this = this;
            var $form = $('form', portlet);
            var _validationRules = {
                "user[email]": { required: true, email: true },
                "groups[]": { required: true }
            };
            if ($form.data('type') !== 'update') {
                _validationRules["password"] = { required: true };
            }
            new form_1.Form($form, {
                state: state,
                validation: {
                    rules: _validationRules,
                },
                completeSubmit: function () {
                    _this.trigger('updated');
                },
            });
        };
        return User;
    }(backend_1.MicroEvent));
    return new User();
});
//# sourceMappingURL=users.js.map