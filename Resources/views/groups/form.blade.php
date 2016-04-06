@extends(\Request::ajax() ? 'backend::layouts.empty' : 'backend::layouts.master')
@section('content')
    <div class="portlet box blue-hoki ajaxbox show" data-form="form-portlet">
        <div class="portlet-title">
            <div class="caption">
                {{$model->exists ? trans('backend::common.edit_group') : trans('backend::common.create_group')}}</div>
            <div class="actions">
                <a class="btn btn-default btn-sm" rel="to-list" href="{{route('backend.backend.groups')}}">
                    <i class="fa fa-arrow-left"></i> {{trans('backend::common.buttons.back')}}</a>
            </div>
        </div>

        <div class="portlet-body">
            <form id="groups-form" method="post" class="form"
                  action="{{$model->exists ? route('backend.backend.groups.update', ['id' => $model->id]) : route('backend.backend.groups.store')}}">
                <input type="hidden" name="_token" value="{{csrf_token()}}">

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
                                        <th colspan="2">{{trans('backend::common.section')}}</th>
                                        <th style="width: 100px;">{{trans('backend::common.rules.read')}}</th>
                                        <th style="width: 100px;">{{trans('backend::common.rules.write')}}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($rules as $module => $sections)
                                        <tr>
                                            <td colspan="2" style="font-weight: bold; font-style: italic; background-color: #eee !important;">
                                                {{array_key_exists('*', $sections) ? $sections['*'] : $module}}
                                            </td>
                                            <td style="background-color: #eee !important;">
                                                <input class="module-read-rule" type="checkbox" data-module="{{$module}}">
                                            </td>
                                            <td style="background-color: #eee !important;">
                                                <input class="module-write-rule" type="checkbox" data-module="{{$module}}">
                                            </td>
                                        </tr>
                                        @foreach($sections as $section => $list)
                                            @if(is_array($list))
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
                                            @endif
                                        @endforeach
                                    @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <div class="pull-right">
                        <a class="btn red" rel="to-list" href="{{route('backend.backend.groups')}}">
                            <i class="fa fa-close"></i> {{trans('backend::common.buttons.cancel')}}</a>
                        <button type="submit" class="btn green"><i class="fa fa-check"></i> {{trans('backend::common.buttons.save')}}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@stop