/// <reference path="../../../dt/index.d.ts" />

import * as $ from "jquery";
import {RabbitCMS} from "rabbitcms/backend";
import "css!jquery.colorbox/colorbox.css";

let lang:string = RabbitCMS.getLocale(new Map<string,string>()
    .set('en_US', 'en')
    .set('ru_RU', 'ru')
    .set('uk_UA', 'uk')
);