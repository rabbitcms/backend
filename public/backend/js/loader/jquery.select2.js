/// <reference path="../../dt/index.d.ts" />
define(["require", "exports", "jquery", "rabbitcms/backend", "select2", "css!select2/css/select2.min.css", "css!select2/css/select2-bootstrap.min.css", "css!styles/plugins/select2.css"], function (require, exports, $, backend_1) {
    "use strict";
    var lang = backend_1.RabbitCMS.getLocale(new Map()
        .set('en_US', 'en')
        .set('ru_RU', 'ru')
        .set('uk_UA', 'uk'));
    return new Promise(function (resolve) {
        require(['select2/js/i18n/' + lang], function () {
            $.fn.select2.defaults.set('language', lang);
            $.fn.select2.defaults.set('theme', 'bootstrap');
            $.fn.select2.defaults.set('width', 'auto');
            $.fn.select2.defaults.set('allowClear', true);
            resolve();
        });
    });
});
//# sourceMappingURL=jquery.select2.js.map