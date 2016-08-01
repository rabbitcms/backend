
import * as $ from "jquery";
import "jquery.backstretch";
import "jquery.validation";
import {RabbitCMS} from "rabbitcms/backend";

export function init(portlet:JQuery) {
    var _imgPath = RabbitCMS.getAssetsPath()+'/img/bg/';
    var _images = [_imgPath + '1.jpg', _imgPath + '2.jpg', _imgPath + '3.jpg', _imgPath + '4.jpg'];

    $.backstretch(_images, {fade: 1000, duration: 8000});

    var loginForm = $('form', portlet);

    loginForm.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            email: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages: {
            email: {
                required: "Поле Логін обов'язкове для заповнення"
            },
            password: {
                required: "Поле Пароль обов'язкове для заповнення"
            }
        },
        highlight (element:HTMLElement) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success (label:JQuery) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement (error:JQuery, element:JQuery) {
            error.insertAfter(element.closest('.input-icon'));
        },
        submitHandler (form:HTMLFormElement) {
            form.submit();
        }
    });

    loginForm.on('keypress', 'input', (e) => {
        if (e.which == 13) {
            if (loginForm.validate().form()) {
                loginForm.submit();
            }
            return false;
        }
    });
}