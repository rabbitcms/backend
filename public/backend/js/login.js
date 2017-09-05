/// <reference path="../dt/index.d.ts" />
define(["require", "exports", "jquery", "rabbitcms/backend", "rabbitcms/form", "jquery.backstretch", "jquery.validation"], function (require, exports, $, backend_1, form_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init(portlet) {
        var imgPath = backend_1.RabbitCMS.getAssetsPath() + '/img/bg/';
        var images = [imgPath + '1.jpg', imgPath + '2.jpg', imgPath + '3.jpg', imgPath + '4.jpg'];
        $.backstretch(images.sort(function () { return 0.5 - Math.random(); }), { fade: 1000, duration: 8000 });
        var form = $('form', portlet);
        new form_1.Form(form, {
            ajax: false,
            completeSubmit: function (data) {
                return true;
            }
        });
    }
    exports.init = init;
});
//# sourceMappingURL=login.js.map