@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajax-portlet" data-require="">
        <div class="portlet-title">
            <div class="caption">
                {{$model->exists ? trans('backend::groups.edit') : trans('backend::groups.create')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" rel="back" href="{{route('backend.backend.groups')}}">
                    <i class="fa fa-arrow-left"></i> {{trans('backend::common.back')}}</a>
            </div>
        </div>

        <div class="portlet-body form">
            <div class="form-body">
                <div class="tabbable-line">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="#tab_1" data-toggle="tab"> {{trans('backend::groups.group')}}</a></li>
                        @if($model->exists)
                            <li>
                                <a href="#tab_2" data-toggle="tab"> {{trans('backend::groups.users')}}</a></li>
                        @endif
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab_1">
                            <form method="post" data-type="{{$model->exists ? 'update' : 'create'}}" action="{{$model->exists ? route('backend.backend.groups.update', ['id' => $model->id]) : route('backend.backend.groups.store')}}">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="control-label">{{trans('backend::groups.caption')}}</label>
                                            <input class="form-control" name="caption" value="{{$model->caption}}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="table-container">
                                            <table class="table table-striped table-bordered table-hover">
                                                <thead>
                                                <tr role="row" class="heading">
                                                    <th>{{trans('backend::groups.section')}}</th>
                                                    <th>{{trans('backend::groups.abilities')}}</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                @foreach($rules as $group => $caption)
                                                    <tr>
                                                        <td style="font-weight: bold; font-style: italic;">{{$caption}}</td>
                                                        <td>
                                                            @foreach(\Backend::getGroupPermissions($group) as $rule => $caption)
                                                                <label class="mt-checkbox mt-checkbox-outline">
                                                                    <input type="checkbox" @if($model->exists && array_key_exists($rule, $model->permissions)) checked @endif name="permissions[{{$rule}}]" value="1"> {{$caption}}
                                                                    <span></span>
                                                                </label><br>
                                                            @endforeach
                                                        </td>
                                                    </tr>
                                                @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        @if($model->exists)
                            <div class="tab-pane" id="tab_2">
                                <div class="table-container">
                                    <table class="table table-striped table-bordered table-hover" data-link="{{route('backend.backend.groups.users', ['id' => $model->id])}}" id="backend_groups_users_table">
                                        <thead>
                                        <tr role="row" class="heading">
                                            <th data-data="id" style="width: 100px;">{{trans('backend::common.id')}}</th>
                                            <th data-data="name">{{trans('backend::users.name')}}</th>
                                            <th data-data="actions" style="width: 30px;"></th>
                                        </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <div class="pull-right">
                    <a class="btn red" rel="cancel" href="{{route('backend.backend.groups')}}">
                        <i class="fa fa-close"></i> {{trans('backend::common.cancel')}}</a>
                    <button type="submit" class="btn green"><i
                                class="fa fa-save"></i> {{trans('backend::common.save')}}</button>
                </div>
            </div>

        </div>
    </div>
@stop