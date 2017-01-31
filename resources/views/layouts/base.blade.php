<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Адміністрування</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">

    <!-- Styles -->
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css">
    <link href="{{asset_module('css/init.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/font-awesome/css/font-awesome.min.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/simple-line-icons/simple-line-icons.min.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/jquery-ui/jquery-ui.custom.min.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/bootstrap/css/bootstrap.min.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/uniform/css/uniform.default.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/select2/select2.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/bootstrap-datepicker/css/datepicker.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/bootstrap-datepicker/css/datepicker3.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/bootstrap-datetimepicker/css/datetimepicker.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/bootstrap-timepicker/css/bootstrap-timepicker.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('plugins/colorbox/colorbox.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'plugins/jquery-file-upload/css/jquery.fileupload.css')}}" rel="stylesheet" type="text/css">

    <link href="{{asset_module('css/login.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('css/components.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('css/plugins.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('css/layout/layout.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('css/layout/themes/default.css', 'backend')}}" rel="stylesheet" type="text/css">

    <link href="{{asset('backend/css/custom.css')}}" rel="stylesheet" type="text/css">

    <!-- Scripts -->
    <script> var _TOKEN = '{{Session::token()}}'; </script>
    <script src="{{asset_module('plugins/jquery.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/jquery-ui/jquery-ui.custom.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/bootstrap/js/bootstrap.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/js.cookie.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/jquery.block-ui.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/uniform/jquery.uniform.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/bootbox.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/jquery-validation/jquery.validate.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/jquery-validation/additional-methods.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/select2/select2.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/bootstrap-datepicker/js/bootstrap-datepicker.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.uk.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/bootstrap-timepicker/js/bootstrap-timepicker.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/datatables/media/js/jquery.dataTables.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/colorbox/jquery.colorbox.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/backstretch/jquery.backstretch.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/fuelux/js/spinner.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/tinymce/tinymce.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/tinymce/jquery.tinymce.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/tinymce/langs/uk_UA.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/jquery.inputmask.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/highcharts.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{module_asset('backend', 'plugins/bootstrap-touchspin/bootstrap.touchspin.js')}}" type="text/javascript"></script>
    <script src="{{module_asset('backend', 'plugins/jquery-file-upload/js/jquery.fileupload.js')}}" type="text/javascript"></script>

    <script src="{{asset_module('js/metronic.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('js/datatable.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('plugins/require.js', 'backend')}}" type="text/javascript"></script>
</head>
@yield('main')

<script src="{{asset('/backend/config.js')}}" type="text/javascript"></script>
<script>
    define('jquery', [], function() { return jQuery; });
    define('bootbox', [], function() { return bootbox; });
    define('Highcharts', [], function() { return Highcharts; });
    require(["jquery", "rabbitcms.backend"], function ($, RabbitCMS) {
        window.RabbitCMS = new RabbitCMS({
            prefix: {!! json_encode(config('module.backend.path')) !!}
        });

        window.RabbitCMS.onNavigate(function(link) {
            var self = $(this);
            $('li.nav-item, a.nav-link .arrow').removeClass('active open');
            $('a.nav-link').each(function() {
                var self=$(this);
                if(link.lastIndexOf(this.pathname, 0) === 0) {
                    self.parents('li.nav-item').addClass('active open');
                }
            });
        });

        $('body').removeClass('loading');
    });
</script>
</html>