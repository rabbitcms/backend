
import * as $ from "jquery";
//import * as moment from "moment";
import "bootstrap-daterangepicker";
import {RabbitCMS} from "rabbitcms/backend";
import "css!bootstrap-daterangepicker/css/daterangepicker.css";

let lang:string = RabbitCMS.getLocale(new Map<string,string>()
    .set('pt_BR', 'pt-BR')
    .set('pt_PT', 'pt')
    .set('zn_CN','zn_CN')
    .set('zn_TW','zn_TW')
);

//export = moment;

//require(['select2/js/i18n/' + lang]);

//
/*
$.fn.select2.defaults.set('language',lang);
$.fn.select2.defaults.set("theme", "bootstrap");
$.fn.select2.defaults.set("width", "auto");
$.fn.select2.defaults.set("allowClear", true);
*/
