@extends('backend::layouts.base')
@push('styles')
    <link href="{{module_asset('backend', 'backend/css/login.css')}}" rel="stylesheet" type="text/css">
@endpush
@section('main')
    <body class="login loading">
    <div class="logo">
        <a href="{{route('backend.index')}}">
            <img src="{{module_asset('backend', 'img/logo-big.png')}}" alt=""></a>
    </div>
    <div class="content ajax-portlet" data-require="rabbitcms/login:init">
        <form class="login-form" method="post">
            {{csrf_field()}}

            <h3 class="form-title text-center">{{trans('backend::login.title')}}</h3>
            @if($errors->has('credentials'))
                <div class="alert alert-danger">
                    <ul class="list-unstyled">
                        <li>{{$errors->first('credentials')}}</li>
                    </ul>
                </div>
            @endif
            <div class="form-group @if($errors->has('email')) has-error @endif">
                <label class="control-label">{{trans('backend::login.login')}}</label>
                <div class="input-icon">
                    <i class="fa fa-user"></i>
                    <input class="form-control" type="text" value="{{old('email')}}" placeholder="{{trans('backend::login.login')}}" name="email">
                </div>
                @if($errors->has('email'))
                    <span class="help-block">{{$errors->first('email')}}</span>
                @endif
            </div>
            <div class="form-group @if($errors->has('password')) has-error @endif">
                <label class="control-label">{{trans('backend::login.password')}}</label>
                <div class="input-icon">
                    <i class="fa fa-lock"></i>
                    <input class="form-control" type="password" placeholder="{{trans('backend::login.password')}}" name="password">
                </div>
                @if($errors->has('password'))
                    <span class="help-block">{{$errors->first('password')}}</span>
                @endif
            </div>
            <div class="form-actions">
                <label class="remember-me mt-checkbox mt-checkbox-outline">{{trans('backend::login.remember')}}
                    <input type="checkbox" name="remember"><span></span></label>

                <button type="submit" class="btn green pull-right">
                    {{trans('backend::login.sign_in')}} <i class="m-icon-swapright m-icon-white"></i></button>
            </div>
        </form>
    </div>
    </body>
@stop