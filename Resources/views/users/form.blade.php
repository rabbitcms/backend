@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajax-portlet" data-require="">
        <div class="portlet-title">
            <div class="caption">
                {{$model->exists ? trans('backend::users.edit') : trans('backend::users.create')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" rel="back" href="{{route('backend.backend.users')}}">
                    <i class="fa fa-arrow-left"></i> {{trans('backend::common.back')}}</a>
            </div>
        </div>

        <div class="portlet-body form">
            <form method="post" data-type="{{$model->exists ? 'update' : 'create'}}"
                  action="{{$model->exists ? route('backend.backend.users.update', ['id' => $model->id]) : route('backend.backend.users.store')}}">
                <div class="form-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::users.email')}}</label>
                                <input class="form-control" name="email" value="{{$model->email}}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::users.password')}}</label>
                                <input type="text" class="form-control" name="password">
                                <span class="help-block">{{trans('backend::users.change_password')}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::users.status')}}</label>
                                <select name="active" class="form-control">
                                    <option @if($model->exists && $model->active === 1) selected @endif value="1">{{trans('backend::users.status_1')}}</option>
                                    <option @if($model->exists && $model->active === 0) selected @endif value="0">{{trans('backend::users.status_0')}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">{{trans('backend::users.groups')}}</label>
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
                                <label class="control-label">{{trans('backend::users.name')}}</label>
                                <input class="form-control" name="name" value="{{$model->name}}">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <div class="pull-right">
                        <a class="btn red" rel="cancel" href="{{route('backend.backend.users')}}">
                            <i class="fa fa-close"></i> {{trans('backend::common.cancel')}}</a>
                        <button type="submit" class="btn green"><i class="fa fa-save"></i> {{trans('backend::common.save')}}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@stop