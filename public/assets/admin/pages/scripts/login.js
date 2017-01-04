var Login = function ($) {

    var handleLogin = function () {
        var loginForm = $('.login-form');
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
                },
                remember: {
                    required: false
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

        $('input', '.login-form').keypress(function (e) {
            if (e.which == 13) {
                if (loginForm.validate().form()) {
                    loginForm.submit();
                }
                return false;
            }
        });
    };

    return {
        init: function () {
            handleLogin();
        }
    };
}(jQuery);