@extends('backend::layouts.base')
@section('main')
    <body class="login">
    <div class="logo">
        <a href="/"><img src="/backend/assets/admin/layout/img/logo-big.png" alt=""/></a></div>
    <div class="menu-toggler sidebar-toggler"></div>
    <div class="content">
        <form class="login-form" action="" method="post">
            <input type="hidden" name="_token" value="{{Session::token()}}">

            <h3 class="form-title text-center">Увійдіть в свій обліковий запис</h3>
            @if (count($errors) > 0)
                <div class="alert alert-danger">
                    <ul class="list-unstyled">
                        @foreach ($errors->all() as $error)
                            <li>{{$error}}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="form-group">
                <label class="control-label visible-ie8 visible-ie9">Логін</label>

                <div class="input-icon">
                    <i class="fa fa-user"></i>
                    <input class="form-control placeholder-no-fix" type="text" value="{{old('email')}}"
                           placeholder="Логін" name="email"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label visible-ie8 visible-ie9">Пароль</label>

                <div class="input-icon">
                    <i class="fa fa-lock"></i>
                    <input class="form-control placeholder-no-fix" type="password" placeholder="Пароль"
                           name="password"/>
                </div>
            </div>
            <div class="form-actions">
                <label class="checkbox">
                    <input type="checkbox" name="remember"/> Запам'ятати мене</label>
                <button type="submit" class="btn green pull-right">
                    Увійти <i class="m-icon-swapright m-icon-white"></i></button>
            </div>
        </form>
    </div>
    </body>
@stop