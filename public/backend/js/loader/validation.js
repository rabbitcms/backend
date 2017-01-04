define(["require", "exports", "jquery", "rabbitcms/backend", "jquery.validation", "jquery.validation/additional-methods"], function (require, exports, $, backend_1) {
    "use strict";
    var lang = backend_1.RabbitCMS.getLocale(new Map()
        .set('en_US', 'en')
        .set('ru_RU', 'ru')
        .set('uk_UA', 'uk')
        .set('es', 'es_CL')
        .set('sr', 'sr_lat')
        .set('pt', 'pt_PT'));
    if (lang !== 'en') {
        require(['jquery.validation/localization/messages_' + lang]);
    }
    if (lang === 'pt_BR') {
        lang = 'pt';
    }
    var methods = ['de', 'es_CL', 'fi', 'nl', 'pt'];
    if (methods.indexOf(lang) >= 0) {
        require(['jquery.validation/localization/methods_' + lang]);
    }
    $.validator.setDefaults({
        ignore: '',
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