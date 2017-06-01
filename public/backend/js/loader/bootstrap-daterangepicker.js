define(["require", "exports", "moment", "rabbitcms/backend", "bootstrap-daterangepicker", "css!bootstrap-daterangepicker/css/daterangepicker.css"], function (require, exports, moment, backend_1) {
    "use strict";
    var lang = backend_1.RabbitCMS.getLocale(new Map()
        .set('pt_BR', 'pt-BR')
        .set('pt_PT', 'pt')
        .set('zn_CN', 'zn_CN')
        .set('zn_TW', 'zn_TW')
        .set('en_US', 'en')
        .set('ru_RU', 'ru')
        .set('uk_UA', 'uk'));
    return new Promise(function (resolve) {
        require(['moment/locale/' + lang], function () {
            moment.locale(lang);
            resolve(moment);
        });
    });
});
//# sourceMappingURL=bootstrap-daterangepicker.js.map