@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajax-portlet" data-require="rabbitcms.backend.users.groups:table" data-permanent="permanent">
        <div class="portlet-title">
            <div class="caption">
                {{trans('backend::common.groups')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" rel="ajax-portlet" href="{{relative_route('backend.backend.groups.create')}}">
                    <i class="fa fa-plus"></i> {{trans('backend::common.buttons.create')}}</a></div>
        </div>

        <div class="portlet-body">
            <div class="table-container">
                <table class="table table-striped table-bordered table-hover data-table" data-link="{{relative_route('backend.backend.groups.list')}}">
                    <thead>
                    <tr role="row" class="heading">
                        <th style="width: 100px;">{{trans('backend::common.table.id')}}</th>
                        <th>{{trans('backend::common.group')}}</th>
                        <th style="width: 100px;">{{trans('backend::common.table.actions')}}</th>
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
@stop

