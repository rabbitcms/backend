@extends('backend::layouts.base')
@push('styles')
<link href="{{asset_module('backend/css/login.css', 'backend')}}" rel="stylesheet" type="text/css">
@endpush
@section('main')
    <body class="login loading">
    <div class="logo">
        <a href="{{relative_route('backend.index')}}">
            <img src="{{asset_module('img/logo-big.png','backend')}}" alt=""></a></div>
    <div class="content ajax-portlet" data-require="rabbitcms.backend.login:init">
        <form class="login-form" action="" method="post">
            <input type="hidden" name="_token" value="{{csrf_token()}}">

            <h3 class="form-title text-center">Увійдіть в свій обліковий запис</h3>
            @if(isset($errors) && count($errors) > 0)
                <div class="alert alert-danger">
                    <ul class="list-unstyled">
                        @foreach ($errors->all() as $error)
                            <li>{{$error}}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="form-group">
                <label class="control-label">Логін</label>

                <div class="input-icon">
                    <i class="fa fa-user"></i>
                    <input class="form-control" type="text" value="{{old('email')}}" placeholder="Логін" name="email">
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">Пароль</label>

                <div class="input-icon">
                    <i class="fa fa-lock"></i>
                    <input class="form-control" type="password" placeholder="Пароль" name="password">
                </div>
            </div>
            <div class="form-actions">
                <label class="checkbox">
                    <input type="checkbox" name="remember"> Запам'ятати мене</label>
                <button type="submit" class="btn green pull-right">
                    Увійти <i class="m-icon-swapright m-icon-white"></i></button>
            </div>
        </form>
    </div>
    </body>
@stop