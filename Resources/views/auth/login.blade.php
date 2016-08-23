@extends('backend::layouts.base')
@push('styles') <link href="{{ asset_module('backend/css/login.css', 'backend') }}" rel="stylesheet" type="text/css"> @endpush
@section('main')
    <body class="login loading">
    <div class="logo">
        <a href="{{ relative_route('backend.index') }}">
            <img src="{{ asset('backend/logo-big.png') }}" alt=""></a></div>
    <div class="content ajax-portlet" data-require="rabbitcms/login:init">
        <form class="login-form" method="post">
            <input type="hidden" name="_token" value="{{ csrf_token() }}">

            <h3 class="form-title text-center">{{ trans('backend::login.title') }}</h3>
            @if(isset($errors) && count($errors) > 0)
                <div class="alert alert-danger">
                    <ul class="list-unstyled">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="form-group">
                <label class="control-label">{{ trans('backend::login.login') }}</label>

                <div class="input-icon">
                    <i class="fa fa-user"></i>
                    <input class="form-control" type="text" value="{{ old('email') }}" placeholder="{{ trans('backend::login.login') }}" name="email">
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">{{ trans('backend::login.password') }}</label>

                <div class="input-icon">
                    <i class="fa fa-lock"></i>
                    <input class="form-control" type="password" placeholder="{{ trans('backend::login.password') }}" name="password">
                </div>
            </div>
            <div class="form-actions">
                <label class="remember-me mt-checkbox mt-checkbox-outline">{{ trans('backend::login.remember') }}
                    <input type="checkbox" name="remember"><span></span></label>

                <button type="submit" class="btn green pull-right">
                    {{ trans('backend::login.sign_in') }} <i class="m-icon-swapright m-icon-white"></i></button>
            </div>
        </form>
    </div>
    </body>
@stop