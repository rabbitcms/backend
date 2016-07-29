define(["require", "exports", "jquery", "rabbitcms/backend", "select2", "css!select2/css/select2.min.css", "css!select2/css/select2-bootstrap.min.css", "css!styles/plugins/select2.css"], function (require, exports, $, backend_1, select2) {
    "use strict";
    var lang = backend_1.RabbitCMS.getLocale(new Map([
        ['pt_BR', 'pt-BR'],
        ['pt_PT', 'pt'],
        ['zn_CN', 'zn_CN'],
        ['zn_TW', 'zn_TW'],
    ]));
    require(['select2/js/i18n/' + lang]);
    $.fn.select2.defaults.set('language', lang);
    $.fn.select2.defaults.set("theme", "bootstrap");
    $.fn.select2.defaults.set("width", "auto");
    $.fn.select2.defaults.set("allowClear", true);
    return select2;
});
//# sourceMappingURL=jquery.select2.js.map