<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Адміністрування</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="" />
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
    @foreach(\RabbitCMS\Backend\Support\Metronic::css() as $css)
        <link href="{{\RabbitCMS\Backend\Support\Metronic::base()}}{{$css}}" rel="stylesheet" type="text/css"/>
    @endforeach
    @foreach(\RabbitCMS\Backend\Support\Metronic::js() as $js)
        <script src="{{\RabbitCMS\Backend\Support\Metronic::base()}}{{$js}}" type="text/javascript"></script>
    @endforeach
    <script>
        jQuery(document).ready(function () {
            {!!\RabbitCMS\Backend\Support\Metronic::dr()!!}
        });
        var _TOKEN = '{{Session::token()}}';
    </script>
</head>
@yield('main')
</html>