define(["jquery"], function ($) {
    "use strict";

    function table(portlet) {
        var dataTable = new Datatable();
        var tableSelector = $('.data-table', portlet);

        dataTable.setAjaxParam('_token', _TOKEN);
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

        MicroEvent.bind('users.updated', function () {
            dataTable.getDataTable().ajax.reload();
        });

        portlet.on('click', '[rel="destroy"]', function () {
            var self = $(this);
            var link = self.attr('href');

            RabbitCMS.Dialogs.onDelete(link, function () {
                dataTable.getDataTable().ajax.reload();
            });

            return false;
        });
    }

    function form(portlet) {
        var form = $('form', portlet);
        var _validationRules = {};

        $('.select2').select2();

        if (form.data('type') === 'update') {
            _validationRules = {
                "user[email]": {
                    required: true,
                    email: true
                },
                "groups[]": {
                    required: true
                }
            }
        } else {
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
            }
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
                return false;
            },
            submitHandler: function (form) {
                RabbitCMS.submitForm(form, function (data) {
                    MicroEvent.trigger('users.updated');
                });
            }
        });
    }

    var MicroEvent = new RabbitCMS.MicroEvent({table: table, form: form});

    return MicroEvent;
});