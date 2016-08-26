define(["require", "exports", "jquery", "rabbitcms/backend", "css!select2/css/select2.min.css", "css!select2/css/select2-bootstrap.min.css", "css!styles/plugins/select2.css"], function (require, exports, $, backend_1) {
    "use strict";
    var lang = backend_1.RabbitCMS.getLocale(new Map()
        .set('pt_BR', 'pt-BR')
        .set('pt_PT', 'pt')
        .set('zn_CN', 'zn_CN')
        .set('zn_TW', 'zn_TW'));
    require(['select2/js/i18n/' + lang]);
    $.fn.select2.defaults.set('language', lang);
    $.fn.select2.defaults.set("theme", "bootstrap");
    $.fn.select2.defaults.set("width", "auto");
    $.fn.select2.defaults.set("allowClear", true);
});
//# sourceMappingURL=jquery.select2.js.map