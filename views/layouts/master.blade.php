@extends('backend::layouts.base')
@section('main')
    <body class="page-header-fixed page-quick-sidebar-over-content">
    <div class="page-header navbar navbar-fixed-top">
        <div class="page-header-inner">
            <div class="page-logo">
                <a href="/">
                    <img src="/backend/assets/admin/layout/img/logo.png" alt="logo" class="logo-default"/></a>
                <div class="menu-toggler sidebar-toggler"></div>
            </div>
            <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"></a>
            <div class="top-menu">
                <ul class="nav navbar-nav pull-right">
                    <li class="dropdown dropdown-user">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                            <img alt="" class="img-circle hide1" src="/backend/assets/admin/layout/img/avatar3_small.jpg"/>
                            <span class="username username-hide-on-mobile">{{--{{\Auth::user()->name()}}--}}</span>
                            <i class="fa fa-angle-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/auth/logout"><i class="icon-key"></i> Вийти </a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="clearfix"></div>
    <div class="page-container">
        <div class="page-sidebar-wrapper">
            <div class="page-sidebar navbar-collapse collapse">
                @include('backend::layouts.menu')
            </div>
        </div>
        <div class="page-content-wrapper">
            <div class="page-content">
                <div class="page-bar">
                    <ul class="page-breadcrumb">
                        @foreach(\RabbitCMS\Backend\Support\Metronic::breadcrumbs() as $k => $item)
                            @if ($k == 0)
                                <li>
                                    <i class="fa fa-home"></i>
                                    <a href="{{$item[1]}}">{{$item[0]}}</a></li>
                            @else
                                <li>
                                    <i class="fa fa-angle-right"></i>
                                    <a href="{{$item[1]}}">{{$item[0]}}</a></li>
                            @endif
                        @endforeach
                    </ul>
                </div>
                @yield('content')
            </div>
        </div>
    </div>
    <div class="page-footer">
        <div class="page-footer-inner">2015 &copy;</div>
        <div class="scroll-to-top"><i class="icon-arrow-up"></i></div>
    </div>
    </body>
@stop
