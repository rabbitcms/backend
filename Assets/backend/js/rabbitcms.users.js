var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jquery", "rabbitcms.backend", "rabbitcms.datatable", "jquery.validation"], function (require, exports, $, rabbitcms_backend_1, rabbitcms_datatable_1) {
    "use strict";
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            _super.apply(this, arguments);
        }
        User.prototype.table = function (portlet) {
            var dataTable = new rabbitcms_datatable_1.DataTable();
            var tableSelector = $('.data-table', portlet);
            if (tableSelector.data('init') === true) {
                return;
            }
            tableSelector.data('init', true);
            dataTable.setAjaxParam('_token', rabbitcms_backend_1.RabbitCMS.getToken());
            dataTable.init({
                src: tableSelector,
                dataTable: {
                    ajax: {
                        url: tableSelector.data('link')
                    },
                    ordering: false
                }
            });
            tableSelector.on('change', '.form-filter', function () {
                dataTable.submitFilter();
            });
            this.bind('users.updated', function () {
                dataTable.getDataTable().ajax.reload();
            });
            portlet.on('click', '[rel="destroy"]', function (e) {
                var link = $(e.target).attr('href');
                rabbitcms_backend_1.RabbitCMS.Dialogs.onDelete(link, function () {
                    dataTable.getDataTable().ajax.reload();
                });
                return false;
            });
        };
        User.prototype.form = function (portlet) {
            var _this = this;
            var form = $('form', portlet);
            var _validationRules = {};
            rabbitcms_backend_1.RabbitCMS.select2($('.select2'));
            if (form.data('type') === 'update') {
                _validationRules = {
                    "user[email]": {
                        required: true,
                        email: true
                    },
                    "groups[]": {
                        required: true
                    }
                };
            }
            else {
                _validationRules = {
                    "user[email]": {
                        required: true,
                        email: true
                    },
                    "password": {
                        required: true
                    },
                    "groups[]": {
                        required: true
                    }
                };
            }
            form.validate({
                focusInvalid: true,
                rules: _validationRules,
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorPlacement: function (error, element) {
                },
                submitHandler: function (form) {
                    rabbitcms_backend_1.RabbitCMS.submitForm(form, function () {
                        _this.trigger('users.updated');
                    });
                }
            });
        };
        return User;
    }(rabbitcms_backend_1.MicroEvent));
    return new User();
});
//# sourceMappingURL=rabbitcms.users.js.map