/// <reference path="../../dt/index.d.ts" />
define(["require", "exports", "jquery", "rabbitcms/backend", "bootstrap-datepicker", "css!bootstrap-datepicker/css/bootstrap-datepicker3.css", "css!styles/plugins/bootstrap-datepicker.css"], function (require, exports, $, backend_1) {
    "use strict";
    var lang = backend_1.RabbitCMS.getLocale(new Map()
        .set('en_US', 'en')
        .set('ru_RU', 'ru')
        .set('uk_UA', 'uk'));
    return new Promise(function (resolve) {
        require([("bootstrap-datepicker/locales/bootstrap-datepicker." + lang + ".min")], function () {
            $.fn.datepicker.defaults.language = lang;
            $.fn.datepicker.defaults.autoclose = true;
            resolve();
        });
    });
});
//# sourceMappingURL=bootstrap-datepicker.js.map