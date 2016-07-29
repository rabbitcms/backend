@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajax-portlet" data-require="rabbitcms/users:form">
        <div class="portlet-title">
            <div class="caption">
                {{$model->exists ? trans('backend::common.edit_user') : trans('backend::common.create_user')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" rel="back" href="{{relative_route('backend.backend.users')}}">
                    <i class="fa fa-arrow-left"></i> {{trans('backend::common.buttons.back')}}</a>
            </div>
        </div>

        <div class="portlet-body">
            <form id="users-form" method="post" class="form" data-type="{{$model->exists ? 'update' : 'create'}}"
                  action="{{$model->exists ? relative_route('backend.backend.users.update', ['id' => $model->id]) : relative_route('backend.backend.users.store')}}">
                <input type="hidden" name="_token" value="{{csrf_token()}}">

                <div class="form-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::common.form.email')}}</label>
                                <input class="form-control" name="user[email]" value="{{$model->email}}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::common.form.password')}}</label>
                                <input type="text" class="form-control" name="password">
                                <span class="help-block">{{trans('backend::common.form.change_password')}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::common.form.status')}}</label>
                                <select name="user[active]" class="form-control">
                                    <option @if($model->exists && $model->active == 1) selected="selected" @endif value="1">
                                        {{trans('backend::common.form.active')}}</option>
                                    <option @if($model->exists && $model->active == 0) selected="selected" @endif value="0">
                                        {{trans('backend::common.form.non_active')}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::common.groups')}}</label>
                                <select name="groups[]" multiple="multiple" class="form-control select2">
                                    @foreach($groups as $group)
                                        <option @if($model->exists && $model->groups->keyBy('id')->has($group->id)) selected="selected" @endif value="{{$group->id}}">
                                            {{$group->caption}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::common.form.name')}}</label>
                                <input class="form-control" name="user[name]" value="{{$model->name}}">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <div class="pull-right">
                        <a class="btn red" rel="back" href="{{relative_route('backend.backend.users')}}">
                            <i class="fa fa-close"></i> {{trans('backend::common.buttons.cancel')}}</a>
                        <button type="submit" class="btn green"><i class="fa fa-check"></i> {{trans('backend::common.buttons.save')}}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@stop