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

        MicroEvent.bind('groups.updated', function () {
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

        form.validate({
            focusInvalid: true,
            rules: {
                "groups[caption]": {
                    required: true
                }
            },
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
                    MicroEvent.trigger('groups.updated');
                });
            }
        });
    }

    var MicroEvent = new RabbitCMS.MicroEvent({table: table, form: form});

    return MicroEvent;
});