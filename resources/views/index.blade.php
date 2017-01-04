@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajax-portlet">
        <div class="portlet-title">
            <div class="caption">
                <i class="fa fa-home"></i> Головна</div>
        </div>
        <div class="portlet-body"></div>
    </div>
@stop
