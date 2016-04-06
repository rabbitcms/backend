jQuery(function ($) {
    'use strict';

    var dataTable = new Datatable();
    var tableSelector = $('#data-table');

    dataTable.setAjaxParam('_token', _TOKEN);
    dataTable.init({
        src: tableSelector,
        dataTable: {
            ordering: false
        }
    });

    tableSelector.on('change', '.form-filter', function () {
        dataTable.submitFilter();
    });

    var aWrapper = new AdminWrapper();

    aWrapper.init({
        listPortlet: 'list-portlet'
    });

    aWrapper.ajaxPortlet('[rel="create-portlet"]', 'form-portlet', _CreateCallback);
    aWrapper.ajaxPortlet('[rel="edit-portlet"]', 'form-portlet', _EditCallback);
    aWrapper.destroyItem('[rel="destroy"]', function () {
        dataTable.getDataTable().ajax.reload();
    });
    aWrapper.backToList('[rel="to-list"]');

    function _CreateCallback() {
        var _FormID = '#users-form';

        aWrapper.select2($('.select2'));

        $(_FormID).validate({
            ignore: '',
            rules: {
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
                aWrapper.submitToList($(form), function () {
                    dataTable.getDataTable().ajax.reload();
                });
            }
        });
    }

    function _EditCallback() {
        var _FormID = '#users-form';

        aWrapper.select2($('.select2'));

        $(_FormID).validate({
            ignore: '',
            rules: {
                "user[email]": {
                    required: true,
                    email: true
                },
                "groups[]": {
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
                aWrapper.submitToList($(form), function () {
                    dataTable.getDataTable().ajax.reload();
                });
            }
        });
    }
});
