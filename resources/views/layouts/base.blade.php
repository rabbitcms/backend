<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{trans('backend::common.administration')}}</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">

    <!-- Styles -->
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/css/init.css')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/plugins/font-awesome/css/font-awesome.min.css')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/plugins/simple-line-icons/simple-line-icons.min.css')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/plugins/jquery-ui/jquery-ui.custom.min.css')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/plugins/bootstrap/css/bootstrap.min.css')}}" rel="stylesheet" type="text/css">

    <link href="{{module_asset('backend', 'backend/css/components.css')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/css/plugins.css')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/css/layout/layout.css')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/css/layout/themes/default.css')}}" rel="stylesheet" type="text/css">
    <link href="{{module_asset('backend', 'backend/css/layout/custom.css')}}" rel="stylesheet" type="text/css">

    <link href="{{module_asset('backend', 'css/custom.css')}}" rel="stylesheet" type="text/css">

    @stack('styles')

    <!-- Scripts -->
    <script src="{{module_asset('backend', 'backend/plugins/jquery.min.js')}}" type="text/javascript"></script>
    <script src="{{module_asset('backend', 'backend/plugins/jquery-ui/jquery-ui.custom.min.js')}}" type="text/javascript"></script>
    <script src="{{module_asset('backend', 'backend/plugins/bootstrap/js/bootstrap.min.js')}}" type="text/javascript"></script>
    <script src="{{module_asset('backend', 'backend/plugins/require.js')}}" type="text/javascript"></script>

    <script src="{{route('backend.config.js',[],false)}}" type="text/javascript"></script>
    <script>
        require.config({
            config: {
                i18n: {
                    locale: "{{str_replace('_','-',Lang::getLocale())}}"
                }
            }
        });
        require(["jquery", "rabbitcms/backend"], function ($, rbc) {
            rbc.RabbitCMS.setAssetsPath('{{module_asset('backend', 'backend')}}');
            rbc.RabbitCMS.setLocale('{{\Lang::getLocale()}}');
            rbc.RabbitCMS.setToken('{{csrf_token()}}');
            $('body').removeClass('loading');
        });
    </script>
</head>
@yield('main')
</html>