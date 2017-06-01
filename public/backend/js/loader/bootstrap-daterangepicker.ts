
import * as $ from "jquery";
import * as moment from "moment";
import "bootstrap-daterangepicker";
import {RabbitCMS} from "rabbitcms/backend";
import "css!bootstrap-daterangepicker/css/daterangepicker.css";

let lang:string = RabbitCMS.getLocale(new Map<string,string>()
    .set('pt_BR', 'pt-BR')
    .set('pt_PT', 'pt')
    .set('zn_CN','zn_CN')
    .set('zn_TW','zn_TW')
    .set('en_US', 'en')
    .set('ru_RU', 'ru')
    .set('uk_UA', 'uk')
);

export = new Promise((resolve) => {
    require(['moment/locale/' + lang], function () {
        moment.locale(lang);

        resolve(moment);
    });
});
