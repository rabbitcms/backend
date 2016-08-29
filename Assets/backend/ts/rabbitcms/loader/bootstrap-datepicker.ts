/// <reference path="../../../dt/index.d.ts" />

import * as $ from "jquery";
import {RabbitCMS} from "rabbitcms/backend";
import "bootstrap-datepicker";

import "css!bootstrap-datepicker/css/bootstrap-datepicker3.css";
import "css!styles/plugins/bootstrap-datepicker.css";

let lang:string = RabbitCMS.getLocale(new Map<string,string>()
    .set('en_US', 'en')
    .set('ru_RU', 'ru')
    .set('uk_UA', 'uk')
);

export = new Promise((resolve) => {
    require([`bootstrap-datepicker/locales/bootstrap-datepicker.${lang}.min`], function () {
        $.fn.datepicker.defaults.language = lang;
        $.fn.datepicker.defaults.autoclose = true;
        resolve();
    });
});