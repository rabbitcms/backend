<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Адміністрування</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">

    <!-- Styles -->

    <link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet"
          type="text/css">
    <link href="{{asset_module('backend/css/init.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('backend/plugins/font-awesome/css/font-awesome.min.css', 'backend')}}" rel="stylesheet"
          type="text/css">
    <link href="{{asset_module('backend/plugins/simple-line-icons/simple-line-icons.min.css', 'backend')}}"
          rel="stylesheet" type="text/css">
    <link href="{{asset_module('backend/plugins/jquery-ui/jquery-ui.custom.min.css', 'backend')}}" rel="stylesheet"
          type="text/css">
    <link href="{{asset_module('backend/plugins/bootstrap/css/bootstrap.min.css', 'backend')}}" rel="stylesheet"
          type="text/css">

    {{--<link href="{{asset_module('plugins/uniform/css/uniform.default.css', 'backend')}}" rel="stylesheet" type="text/css">--}}
    {{--<link href="{{asset_module('plugins/select2/select2.css', 'backend')}}" rel="stylesheet" type="text/css">--}}
    {{--<link href="{{asset_module('plugins/bootstrap-datepicker/css/datepicker.css', 'backend')}}" rel="stylesheet" type="text/css">--}}
    {{--<link href="{{asset_module('plugins/bootstrap-datepicker/css/datepicker3.css', 'backend')}}" rel="stylesheet" type="text/css">--}}
    {{--<link href="{{asset_module('plugins/bootstrap-datetimepicker/css/datetimepicker.css', 'backend')}}" rel="stylesheet" type="text/css">--}}
    {{--<link href="{{asset_module('plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css', 'backend')}}" rel="stylesheet" type="text/css">--}}
    {{--<link href="{{asset_module('plugins/colorbox/colorbox.css', 'backend')}}" rel="stylesheet" type="text/css">--}}

    {{--<link href="{{asset_module('css/login.css', 'backend')}}" rel="stylesheet" type="text/css">--}}
    <link href="{{asset_module('backend/css/components.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('backend/css/plugins.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('backend/css/layout/layout.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('backend/css/layout/themes/default.css', 'backend')}}" rel="stylesheet" type="text/css">
    <link href="{{asset_module('backend/css/layout/custom.css', 'backend')}}" rel="stylesheet" type="text/css">
    @stack('styles')
    <!-- Scripts -->
    <script src="{{asset_module('backend/plugins/jquery.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('backend/plugins/jquery-ui/jquery-ui.custom.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('backend/plugins/bootstrap/js/bootstrap.min.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{asset_module('backend/plugins/require.js', 'backend')}}" type="text/javascript"></script>
    <script src="{{route('backend.config.js',[],false)}}" type="text/javascript"></script>
    <script>
        require.config({
            config: { i18n: {
                    locale: "{{str_replace('_','-',Lang::getLocale())}}"
            }}
        });
        require(["jquery", "rabbitcms.backend"], function ($, rbc) {
            rbc.RabbitCMS.setToken('{{csrf_token()}}');
            $('body').removeClass('loading');
        });
    </script>
</head>
@yield('main')
</html>