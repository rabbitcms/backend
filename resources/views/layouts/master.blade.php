@extends('backend::layouts.base')
@section('main')
    <body class="page-header-fixed page-quick-sidebar-over-content loading">
    <div class="page-header navbar navbar-fixed-top">
        <div class="page-header-inner">
            <div class="page-logo">
                <a href="{{ relative_route('backend.index') }}" rel="ajax-portlet">
                    <img src="{{ asset('backend/logo.png') }}" alt="logo" class="logo-default"></a>
                <div class="menu-toggler sidebar-toggler"></div>
            </div>
            <a href="javascript:void(0);" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"></a>
            <div class="top-menu">
                <ul class="nav navbar-nav pull-right">
                    <li class="dropdown dropdown-user">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                            <img class="img-circle hide1" src="{{asset_module('backend/img/avatar.png','backend')}}" alt="">
                            <span class="username username-hide-on-mobile">
                                {{Auth::guard('backend')->user()->email}}</span>
                            <i class="fa fa-angle-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="{{route('backend.auth.logout')}}">
                                    <i class="fa fa-sign-out"></i> {{trans('backend::common.logout')}}</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="clearfix"></div>
    <div class="page-container">
        @include('backend::layouts.sidebar')
        <div class="page-content-wrapper">
            <div class="page-content">
                <div class="page-bar">
                    {{--<ul class="page-breadcrumb">
                        <li>
                            <i class="fa fa-home"></i>
                            <a rel="ajax-portlet" href="{{relative_route('backend.index')}}">Головна</a></li>
                        @foreach(\RabbitCMS\Backend\Support\Metronic::breadcrumbs() as $k => $item)
                            <li>
                                <i class="fa fa-angle-right"></i>
                                <a rel="ajax-portlet" href="{{$item[1]}}">{{$item[0]}}</a></li>
                        @endforeach
                    </ul>--}}
                </div>
                @yield('content')
            </div>
        </div>
    </div>
    <div class="page-footer">
        <div class="page-footer-inner">{{date('Y')}} &copy; DK</div>
        <div class="scroll-to-top"><i class="icon-arrow-up"></i></div>
    </div>
    </body>
@stop
