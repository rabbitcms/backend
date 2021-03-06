<?php
declare(strict_types=1);
use Illuminate\Support\Facades\Lang;
/* @var Lang */
?>
    <!DOCTYPE html>
<html lang="{{Lang::locale()}}">
<head>
    <meta charset="utf-8">
    <title>{{$title ?? 'Адміністрування'}}</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="user" content="{{\Illuminate\Support\Facades\Auth::guard('backend')->id()}}">

    <!-- Styles -->
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet"
          type="text/css">
    <link href="@masset('css/init.css')" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha256-eZrrJcwDc/3uDhsdt61sL2oOBY362qM3lon1gyExkL0=" crossorigin="anonymous"/>
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css"
          integrity="sha256-7O1DfUu4pybYI7uAATw34eDrgQaWGOfMV/8erfDQz/Q=" crossorigin="anonymous"/>
    <link href="@masset('plugins/jquery-ui/jquery-ui.custom.min.css')" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha256-916EbMg70RQy9LHiGkXzG8hSg9EdNy97GazNG/aiY1w=" crossorigin="anonymous"/>
    <link href="@masset('plugins/uniform/css/uniform.default.css')" rel="stylesheet" type="text/css">
    <link href="@masset('plugins/select2/select2.css')" rel="stylesheet" type="text/css">
    <link href="@masset('plugins/bootstrap-datepicker/css/datepicker.css')" rel="stylesheet" type="text/css">
    <link href="@masset('plugins/bootstrap-datepicker/css/datepicker3.css')" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/smalot-bootstrap-datetimepicker/2.4.4/css/bootstrap-datetimepicker.min.css" integrity="sha256-ff4Vuur4aYrm0ZOAEC/me1LBOcid7PJ5oP9xxvJ0AKQ=" crossorigin="anonymous" />
    <link href="@masset('plugins/bootstrap-timepicker/css/bootstrap-timepicker.css')" rel="stylesheet" type="text/css">
    <link href="@masset('plugins/datatables/media/css/jquery.dataTables.min.css')" rel="stylesheet" type="text/css">
    <link href="@masset('plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css')" rel="stylesheet"
          type="text/css">
    <link href="@masset('plugins/colorbox/colorbox.css')" rel="stylesheet" type="text/css">
    <link href="@masset('plugins/jquery-file-upload/css/jquery.fileupload.css')" rel="stylesheet" type="text/css">
    <link href="@masset('plugins/bootstrap-daterangepicker/daterangepicker-bs3.css')" rel="stylesheet" type="text/css">

    <link href="@masset('css/login.css')" rel="stylesheet" type="text/css">
    <link href="@masset('css/components.css')" rel="stylesheet" type="text/css">
    <link href="@masset('css/plugins.css')" rel="stylesheet" type="text/css">
    <link href="@masset('css/layout/layout.css')" rel="stylesheet" type="text/css">
    <link href="@masset('css/layout/themes/default.css')" rel="stylesheet" type="text/css">

    <link href="{{asset('backend/css/custom.css')}}" rel="stylesheet" type="text/css">

    <!-- Scripts -->
    <script> var _TOKEN = '{{Session::token()}}'; </script>
    <script src="@masset('plugins/jquery.min.js')" type="text/javascript"></script>
    <script src="@masset('plugins/jquery-ui/jquery-ui.custom.min.js')" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha256-U5ZEeKfGNOja007MMD3YBI0A3OSZOQbeG6z2f2Y0hu8=" crossorigin="anonymous"></script>
    <script src="@masset('plugins/js.cookie.js')" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js"
            integrity="sha256-9wRM03dUw6ABCs+AU69WbK33oktrlXamEXMvxUaF+KU=" crossorigin="anonymous"></script>
    <script src="@masset('plugins/uniform/jquery.uniform.min.js')" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js"
            integrity="sha256-4F7e4JsAJyLUdpP7Q8Sah866jCOhv72zU5E8lIRER4w=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/jquery.validate.min.js"
            integrity="sha256-F6h55Qw6sweK+t7SiOJX+2bpSAa3b/fnlrVCJvmEj1A=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/additional-methods.min.js"
            integrity="sha256-0Yg/eibVdKyxkuVo1Qwh0DspoUCHvSbm/oOoYVz32BQ=" crossorigin="anonymous"></script>
    <script src="@masset('plugins/select2/select2.min.js')" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/js/bootstrap-datepicker.min.js"
            integrity="sha256-TueWqYu0G+lYIimeIcMI8x1m14QH/DQVt4s9m/uuhPw=" crossorigin="anonymous"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/smalot-bootstrap-datetimepicker/2.4.4/js/bootstrap-datetimepicker.min.js" integrity="sha256-KWLvsoTXFF8o3o9zKOjUsYC/NPKjgYmUXbrxNk90F8k=" crossorigin="anonymous"></script>
    <script src="@masset('plugins/bootstrap-timepicker/js/bootstrap-timepicker.js')" type="text/javascript"></script>
    <script src="@masset('plugins/datatables/media/js/jquery.dataTables.min.js')" type="text/javascript"></script>
    <script src="@masset('plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js')"
            type="text/javascript"></script>
    <script src="@masset('plugins/colorbox/jquery.colorbox.js')" type="text/javascript"></script>
    <script src="@masset('plugins/backstretch/jquery.backstretch.min.js')" type="text/javascript"></script>
    <script src="@masset('plugins/fuelux/js/spinner.min.js')" type="text/javascript"></script>
    <script src="@masset('plugins/tinymce/tinymce.min.js')" type="text/javascript"></script>
    <script src="@masset('plugins/tinymce/jquery.tinymce.min.js')" type="text/javascript"></script>
    <script src="@masset('plugins/tinymce/langs/uk_UA.js')" type="text/javascript"></script>
    <script src="@masset('plugins/jquery.inputmask.js')" type="text/javascript"></script>
    <script src="@masset('plugins/highcharts.js')" type="text/javascript"></script>
    <script src="@masset('plugins/bootstrap-touchspin/bootstrap.touchspin.js')" type="text/javascript"></script>
    <script src="@masset('plugins/jquery-file-upload/js/jquery.fileupload.js')" type="text/javascript"></script>
    <script src="@masset('plugins/moment.min.js')" type="text/javascript"></script>
    <script src="@masset('plugins/bootstrap-daterangepicker/daterangepicker.js')" type="text/javascript"></script>
    <script src="@masset('plugins/jquery.maskMoney.js')" type="text/javascript"></script>

    @if(app()->getLocale() === 'ru')
        <script src="https://cdnjs.cloudflare.com/ajax/libs/smalot-bootstrap-datetimepicker/2.4.4/js/locales/bootstrap-datetimepicker.ru.js" integrity="sha256-+78H4SxBNFRT9ucry9wmMZwlAubvrFzmQAn4BqxH/uc=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/i18n/ru.js" integrity="sha256-YOIol4UzD2BGvz28zaarwdUDawpKTmEpIcvkwakmAHQ=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/localization/messages_ru.min.js"
                integrity="sha256-pW/I4s3iAUclf7Y7eM20ZSAyHq8yehOG8GRUvXcVnF8=" crossorigin="anonymous"></script>
        <script
            src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/locales/bootstrap-datepicker.ru.min.js"
            integrity="sha256-iGDUwn2IPSzlnLlVeCe3M4ZIxQxjUoDYdEO6oBZw/Go=" crossorigin="anonymous"></script>
        <script>jQuery(function ($) {
                $.fn.datepicker.defaults.language = 'ru';
            });</script>
    @else
        <script src="https://cdnjs.cloudflare.com/ajax/libs/smalot-bootstrap-datetimepicker/2.4.4/js/locales/bootstrap-datetimepicker.uk.js" integrity="sha256-aRWJeT44tz3ih3mZYrvu/dx8w6/vpsfWdepO91GN7ko=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/i18n/uk.js" integrity="sha256-LsPBQ5q5xisqXxgdV4Yf8CU8FO7mhnYRUxm7tJXNl4E=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/localization/messages_uk.min.js"
                integrity="sha256-HL/bvGBevAn+B2oTm4MJzK3EjlChK4Sl7Jc2XOWmu0U=" crossorigin="anonymous"></script>
        <script
            src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/locales/bootstrap-datepicker.uk.min.js"
            integrity="sha256-gJ+sB+muQyOKhTNx/XvtaXXkEr88FXSS3xMgtVR3V+E=" crossorigin="anonymous"></script>
        <script>jQuery(function ($) {
                $.fn.datepicker.defaults.language = 'uk';
            });</script>
    @endif

    <script src="@masset('js/metronic.js')" type="text/javascript"></script>
    <script src="@masset('js/datatable.js')" type="text/javascript"></script>
    <script src="@masset('plugins/require.js')" type="text/javascript"></script>
</head>
@yield('main')

<script src="{{asset('/backend/config.js')}}?{{time()}}" type="text/javascript"></script>
<script>
    define('lang', [], () => jQuery('html').prop('lang'));
    define('jquery', [], () => jQuery);
    define('bootbox', [], () => bootbox);
    define('Highcharts', [], () => Highcharts);
    define('Cookies', [], () => Cookies);
    require(["jquery", "rabbitcms.backend"], function ($, RabbitCMS) {
        window.RabbitCMS = new RabbitCMS({
            prefix: @json(config('module.backend.path'))
        });

        window.RabbitCMS.onNavigate(function (link) {
            var self = $(this);
            $('li.nav-item, a.nav-link .arrow').removeClass('active open');
            $('a.nav-link').each(function () {
                var self = $(this);
                console.log(link);
                if (this.pathname !== '' && link.lastIndexOf(this.pathname, 0) === 0) {
                    self.parents('li.nav-item').addClass('active open');
                }
            });
        });

        $('body').removeClass('loading');
    });
</script>
</html>
