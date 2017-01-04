jQuery(function ($) {
    'use strict';

    var dataTable = new Datatable();
    var tableSelector = $('#data-table');
    var _Body = $('body');

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

    aWrapper.ajaxPortlet('[rel="create-portlet"]', 'form-portlet', _Callback);
    aWrapper.ajaxPortlet('[rel="edit-portlet"]', 'form-portlet', _Callback);
    aWrapper.destroyItem('[rel="destroy"]', function () {
        dataTable.getDataTable().ajax.reload();
    });
    aWrapper.backToList('[rel="to-list"]');

    function _Callback() {
        var _FormID = '#groups-form';

        aWrapper.uniform();

        $(_FormID).validate({
            ignore: '',
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
                aWrapper.submitToList($(form), function () {
                    dataTable.getDataTable().ajax.reload();
                });
            }
        });
    }

    _Body.on('change', '.write-rule', function () {
        if ($(this).is(':checked')) {
            $(this).parents('tr').find('.read-rule').prop('checked', true);
            Metronic.updateUniform();
        }
    });

    _Body.on('change', '.read-rule', function () {
        var _write = $(this).parents('tr').find('.write-rule');
        if (_write.is(':checked')) {
            $(this).prop('checked', true);
            Metronic.updateUniform();
        }
    });

    _Body.on('change', '.module-read-rule', function () {
        var _module = $(this).data('module');
        var _write = $(this).parents('tr').find('.module-write-rule');

        if (_write.is(':checked')) {
            $(this).prop('checked', true);
        }

        $('.' + _module + '.read-rule').prop('checked', $(this).prop('checked')).trigger('change');

        Metronic.updateUniform();
    });

    _Body.on('change', '.module-write-rule', function () {
        var _module = $(this).data('module');
        if ($(this).is(':checked')) {
            $(this).parents('tr').find('.module-read-rule').prop('checked', true);
        }

        $('.' + _module + '.write-rule').prop('checked', $(this).prop('checked')).trigger('change');

        Metronic.updateUniform();
    });
});
