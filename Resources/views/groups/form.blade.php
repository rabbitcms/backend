@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajax-portlet" data-require="rabbitcms.users.groups:form">
        <div class="portlet-title">
            <div class="caption">
                {{$model->exists ? trans('backend::common.edit_group') : trans('backend::common.create_group')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" rel="back" href="{{relative_route('backend.backend.groups')}}">
                    <i class="fa fa-arrow-left"></i> {{trans('backend::common.buttons.back')}}</a>
            </div>
        </div>

        <div class="portlet-body">
            <form method="post" class="form" data-type="{{$model->exists ? 'update' : 'create'}}" action="{{$model->exists ? relative_route('backend.backend.groups.update', ['id' => $model->id]) : relative_route('backend.backend.groups.store')}}">
                <input type="hidden" name="_token" value="{{csrf_token()}}">

                <div class="tabbable-custom">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="#tab_1" data-toggle="tab"> Дані</a></li>
                        @if($model->exists)
                            <li>
                                <a href="#tab_2" data-toggle="tab"> Користувачі</a></li>
                        @endif
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab_1">
                            <div class="form-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="control-label">{{trans('backend::common.form.caption')}}</label>
                                            <input class="form-control" name="groups[caption]" value="{{$model->caption}}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="table-container">
                                            <table class="table table-striped table-bordered table-hover">
                                                <thead>
                                                <tr role="row" class="heading">
                                                    <th>{{trans('backend::common.section')}}</th>
                                                    <th>Можливості</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                @foreach($rules as $group => $caption)
                                                    <tr>
                                                        <td style="font-weight: bold; font-style: italic;">{{$caption}}</td>
                                                        <td>
                                                        @foreach(\BackendAcl::getGroupPermissions($group) as $rule => $caption)
                                                            <label>
                                                                <input class="{{$rule}} read-rule" type="checkbox"
                                                                       @if($model->exists && array_key_exists($rule, $model->permissions)) checked="checked" @endif
                                                                       name="permissions[{{$rule}}]" value="1"> {{$caption}}</label><br>
                                                            {{--<td>
                                                                <input class="{{$module}} read-rule" type="checkbox"
                                                                       @if($model->exists && array_key_exists($module . '.' . $section . '.read', $model->permissions)) checked="checked" @endif
                                                                       name="permissions[{{$module . '.' . $section . '.read'}}]" value="1">
                                                            </td>
                                                            <td>
                                                                <input class="{{$module}} write-rule" type="checkbox"
                                                                       @if($model->exists && array_key_exists($module . '.' . $section . '.write', $model->permissions)) checked="checked" @endif
                                                                       name="permissions[{{$module . '.' . $section . '.write'}}]" value="1">
                                                            </td>--}}
                                                        {{--@if(is_array($list))
                                                            @foreach($list as $key => $val)
                                                                @if($key === '*')
                                                                    <tr>
                                                                        <td></td>
                                                                        <td>{{$val}}</td>
                                                                        <td>
                                                                            <input class="{{$module}} read-rule" type="checkbox"
                                                                                   @if($model->exists && array_key_exists($module . '.' . $section . '.read', $model->permissions)) checked="checked" @endif
                                                                                   name="permissions[{{$module . '.' . $section . '.read'}}]" value="1">
                                                                        </td>
                                                                        <td>
                                                                            <input class="{{$module}} write-rule" type="checkbox"
                                                                                   @if($model->exists && array_key_exists($module . '.' . $section . '.write', $model->permissions)) checked="checked" @endif
                                                                                   name="permissions[{{$module . '.' . $section . '.write'}}]" value="1">
                                                                        </td>
                                                                    </tr>
                                                                @endif
                                                            @endforeach
                                                        @endif--}}
                                                        @endforeach
                                                        </td>
                                                    </tr>
                                                @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @if($model->exists)
                            <div class="tab-pane" id="tab_2">
                                <div class="form-body">
                                    <div class="table-container">
                                        <table class="table table-striped table-bordered table-hover data-table" data-link="{{relative_route('backend.backend.groups.users', ['id' => $model->id])}}">
                                            <thead>
                                            <tr role="row" class="heading">
                                                <th style="width: 100px;">{{trans('backend::common.table.id')}}</th>
                                                <th>{{trans('backend::common.table.name')}}</th>
                                                <th style="width: 45px;">{{trans('backend::common.table.actions')}}</th>
                                            </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>

                <div class="form-actions">
                    <div class="pull-right">
                        <a class="btn red" rel="back" href="{{relative_route('backend.backend.groups')}}">
                            <i class="fa fa-close"></i> {{trans('backend::common.buttons.cancel')}}</a>
                        <button type="submit" class="btn green"><i class="fa fa-check"></i> {{trans('backend::common.buttons.save')}}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@stop