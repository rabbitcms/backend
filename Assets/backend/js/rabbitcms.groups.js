define(["require", "exports", "jquery", "rabbitcms.backend", "rabbitcms.datatable"], function (require, exports, $, rabbitcms_backend_1, rabbitcms_datatable_1) {
    "use strict";
    var Groups = (function (_super) {
        __extends(Groups, _super);
        function Groups() {
            _super.apply(this, arguments);
        }
        Groups.prototype.table = function (portlet) {
            var dataTable = new rabbitcms_datatable_1.DataTable({
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
                rabbitcms_backend_1.RabbitCMS.Dialogs.onDelete($(e.target).attr('href'), function () {
                    dataTable.submitFilter();
                });
            });
        };
        Groups.prototype.form = function (portlet, state) {
            var _this = this;
            var $form = $('form', portlet);
            new rabbitcms_backend_1.Form($form, {
                state: state,
                validation: {
                    rules: { "groups[caption]": { required: true } }
                },
                completeSubmit: function () {
                    _this.trigger('updated');
                }
            });
            portlet.on('change', '.write-rule', function () {
                if ($(this).is(':checked')) {
                    $(this).parents('tr').find('.read-rule').prop('checked', true);
                }
            });
            portlet.on('change', '.read-rule', function () {
                var _write = $(this).parents('tr').find('.write-rule');
                if (_write.is(':checked')) {
                    $(this).prop('checked', true);
                }
            });
            portlet.on('change', '.module-read-rule', function () {
                var _module = $(this).data('module');
                var _write = $(this).parents('tr').find('.module-write-rule');
                if (_write.is(':checked')) {
                    $(this).prop('checked', true);
                }
                $('.' + _module + '.read-rule').prop('checked', $(this).prop('checked')).trigger('change');
            });
            portlet.on('change', '.module-write-rule', function () {
                var _module = $(this).data('module');
                if ($(this).is(':checked')) {
                    $(this).parents('tr').find('.module-read-rule').prop('checked', true);
                }
                $('.' + _module + '.write-rule').prop('checked', $(this).prop('checked')).trigger('change');
            });
            if ($form.data('type') == 'update') {
                var dataTable_1 = new rabbitcms_datatable_1.DataTable({
                    src: $('.data-table', portlet),
                    dataTable: {
                        ordering: false
                    }
                });
                portlet.on('click', '[rel="destroy"]', function (e) {
                    e.preventDefault();
                    rabbitcms_backend_1.RabbitCMS.Dialogs.onDelete($(e.target).attr('href'), function () {
                        dataTable_1.submitFilter();
                    });
                });
            }
        };
        return Groups;
    }(rabbitcms_backend_1.MicroEvent));
    return new Groups();
});
//# sourceMappingURL=rabbitcms.groups.js.map