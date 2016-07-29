/**
 * Created by lnkvisitor on 28.07.16.
 */
import * as $ from "jquery";
import "jquery.validation";
import "jquery.validation/additional-methods";
import {RabbitCMS} from "rabbitcms/backend";

let lang:string = RabbitCMS.getLocale(new Map<string,string>()
    .set('es', 'es_CL')
    .set('sr', 'sr_lat')
    .set('pt', 'pt_PT')
);
require(['jquery.validation/localization/messages_' + lang]);

if (lang === 'pt_BR') {
    lang = 'pt';
}
let methods = ['de', 'es_CL', 'fi', 'nl', 'pt'];
if (methods.indexOf(lang) >= 0) {
    require(['jquery.validation/localization/methods_' + lang]);
}

$.validator.setDefaults({
    focusInvalid: true,
    highlight (element:HTMLElement) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight(element:HTMLElement) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorPlacement() {
    },
});

export = <JQueryValidation.ValidatorStatic>$.validator;