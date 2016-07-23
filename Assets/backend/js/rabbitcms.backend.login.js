define(["require", "exports", "jquery", "rabbitcms.backend", "jquery.backstretch", "jquery.validation"], function (require, exports, $, rabbitcms_backend_1) {
    "use strict";
    function init(portlet) {
        var _imgPath = rabbitcms_backend_1.RabbitCMS.getPath() + '/img/bg/';
        var _images = [_imgPath + '1.jpg', _imgPath + '2.jpg', _imgPath + '3.jpg', _imgPath + '4.jpg'];
        $.backstretch(_images, { fade: 1000, duration: 8000 });
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
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
        loginForm.on('keypress', 'input', function (e) {
            if (e.which == 13) {
                if (loginForm.validate().form()) {
                    loginForm.submit();
                }
                return false;
            }
        });
    }
    exports.init = init;
});
//# sourceMappingURL=rabbitcms.backend.login.js.map