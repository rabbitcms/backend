define(["require", "exports", "jquery", "rabbitcms/backend", "jquery.validation", "jquery.validation/additional-methods"], function (require, exports, $, backend_1) {
    "use strict";
    var lang = backend_1.RabbitCMS.getLocale(new Map([
        ['es', 'es_CL'],
        ['sr', 'sr_lat'],
        ['pt', 'pt_PT']
    ]));
    require(['jquery.validation/localization/messages_' + lang]);
    if (lang === 'pt_BR') {
        lang = 'pt';
    }
    var methods = ['de', 'es_CL', 'fi', 'nl', 'pt'];
    if (methods.indexOf(lang) >= 0) {
        require(['jquery.validation/localization/methods_' + lang]);
    }
    $.validator.setDefaults({
        focusInvalid: true,
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorPlacement: function () {
        },
    });
    return $.validator;
});
//# sourceMappingURL=validation.js.map