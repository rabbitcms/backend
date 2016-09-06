/// <reference path="../../../dt/index.d.ts" />

import * as $ from "jquery";
import {RabbitCMS} from "rabbitcms/backend";
import "select2";

import "css!select2/css/select2.min.css";
import "css!select2/css/select2-bootstrap.min.css";
import "css!styles/plugins/select2.css";

let lang:string = RabbitCMS.getLocale(new Map<string,string>()
    .set('en_US', 'en')
    .set('ru_RU', 'ru')
    .set('uk_UA', 'uk')
);

export = new Promise((resolve) => {
    require(['select2/js/i18n/' + lang], function () {
        $.fn.select2.defaults.set('language', lang);
        $.fn.select2.defaults.set('theme', 'bootstrap');
        $.fn.select2.defaults.set('width', 'auto');
        $.fn.select2.defaults.set('allowClear', true);

        resolve();
    });
});