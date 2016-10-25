@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajax-portlet" data-require="">
        <div class="portlet-title">
            <div class="caption">
                {{trans('backend::users.list')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" href="{{route('backend.backend.users.create')}}">
                    <i class="fa fa-plus"></i> {{trans('backend::common.create')}}</a></div>
        </div>

        <div class="portlet-body">
            <div class="table-container">
                <table class="table table-striped table-bordered table-hover data-table" data-link="{{route('backend.backend.users.list')}}" id="backend_users_table">
                    <thead>
                    <tr role="row" class="heading">
                        <th data-data="id" style="width: 100px;">{{trans('backend::common.id')}}</th>
                        <th data-data="name">{{trans('backend::users.name')}}</th>
                        <th data-data="email">{{trans('backend::users.email')}}</th>
                        <th data-data="status" style="width: 200px;">{{trans('backend::users.status')}}</th>
                        <th data-data="actions" style="width: 110px;"></th>
                    </tr>
                    <tr role="row" class="filter">
                        <td>
                            <input type="text" class="form-control form-filter input-sm" name="filters[id]" placeholder="{{trans('backend::common.id')}}">
                        </td>
                        <td></td>
                        <td>
                            <input type="text" class="form-control form-filter input-sm" name="filters[email]" placeholder="{{trans('backend::users.email')}}">
                        </td>
                        <td>
                            <select name="filters[active]" class="form-control form-filter input-sm">
                                <option value="">{{trans('backend::common.not_selected')}}</option>
                                <option value="0">{{trans('backend::users.status_0')}}</option>
                                <option value="1">{{trans('backend::users.status_1')}}</option>
                            </select>
                        </td>
                        <td>
                            <div class="margin-bottom-5">
                                <button class="btn btn-sm yellow filter-submit" title="{{trans('backend::common.search')}}">
                                    <i class="fa fa-search"></i></button>
                                <button class="btn btn-sm red filter-cancel" title="{{trans('backend::common.reset')}}">
                                    <i class="fa fa-times"></i></button>
                            </div>
                        </td>
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
@stop
