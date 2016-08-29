/// <reference path="../../../dt/index.d.ts" />
/**
 * Created by lnkvisitor on 28.07.16.
 */
import * as $ from "jquery";
import {RabbitCMS} from "rabbitcms/backend";
import * as select2 from "select2";
import "css!select2/css/select2.min.css";
import "css!select2/css/select2-bootstrap.min.css";
import "css!styles/plugins/select2.css";

let lang:string = RabbitCMS.getLocale(new Map<string,string>()
    .set('pt_BR', 'pt-BR')
    .set('pt_PT', 'pt')
    .set('zn_CN','zn_CN')
    .set('zn_TW','zn_TW')
);
require(['select2/js/i18n/' + lang]);

export = select2;

$.fn.select2.defaults.set('language',lang);
$.fn.select2.defaults.set("theme", "bootstrap");
$.fn.select2.defaults.set("width", "auto");
$.fn.select2.defaults.set("allowClear", true);