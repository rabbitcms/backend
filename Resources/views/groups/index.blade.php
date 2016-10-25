@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajax-portlet" data-require="">
        <div class="portlet-title">
            <div class="caption">
                {{trans('backend::groups.list')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" href="{{route('backend.backend.groups.create')}}">
                    <i class="fa fa-plus"></i> {{trans('backend::common.create')}}</a></div>
        </div>

        <div class="portlet-body">
            <div class="table-container">
                <table class="table table-striped table-bordered table-hover data-table" data-link="{{route('backend.backend.groups.list')}}" id="backend_groups_table">
                    <thead>
                    <tr role="row" class="heading">
                        <th data-data="id" style="width: 50px;">{{trans('backend::common.id')}}</th>
                        <th data-data="caption">{{trans('backend::groups.group')}}</th>
                        <th data-data="actions" style="width: 100px;"></th>
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
@stop

