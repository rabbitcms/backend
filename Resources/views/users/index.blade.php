@extends('backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajaxbox show" data-form="list-portlet">
        <div class="portlet-title">
            <div class="caption">
                {{trans('backend::common.users')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" rel="create-portlet" href="{{route('backend.backend.users.create')}}">
                    <i class="fa fa-plus"></i> {{trans('backend::common.buttons.create')}}</a></div>
        </div>

        <div class="portlet-body">
            <div class="table-container">
                <table class="table table-striped table-bordered table-hover" id="data-table">
                    <thead>
                    <tr role="row" class="heading">
                        <th style="width: 100px;">{{trans('backend::common.table.id')}}</th>
                        <th>{{trans('backend::common.table.email')}}</th>
                        <th style="width: 200px;">{{trans('backend::common.table.status')}}</th>
                        <th style="width: 110px;">{{trans('backend::common.table.actions')}}</th>
                    </tr>
                    <tr role="row" class="filter">
                        <td>
                            <input type="text" class="form-control form-filter input-sm" name="filter[id]">
                        </td>
                        <td>
                            <input type="text" class="form-control form-filter input-sm" name="filter[email]"
                                   placeholder="E-mail">
                        </td>
                        <td>
                            <select name="filter[active]" class="form-control form-filter input-sm">
                                <option value="">{{trans('backend::common.table.select')}}</option>
                                <option value="0">{{trans('backend::common.non_active')}}</option>
                                <option value="1">{{trans('backend::common.active')}}</option>
                            </select>
                        </td>
                        <td>
                            <div class="margin-bottom-5">
                                <button class="btn btn-sm yellow filter-submit" title="{{trans('backend::common.buttons.search')}}">
                                    <i class="fa fa-search"></i></button>
                                <button class="btn btn-sm red filter-cancel" title="{{trans('backend::common.buttons.reset')}}">
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

    <script src="{{asset_module('js/admin.wrapper.js', 'backend')}}"></script>
    <script src="{{asset_module('js/users.js', 'backend')}}"></script>
@stop

