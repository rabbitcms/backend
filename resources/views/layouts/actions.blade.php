@if(count($actions))
    <div class="btn-group">
        <a class="btn btn-default btn-sm dropdown-toggle" href="javascript:;" data-toggle="dropdown" aria-expanded="false">
            {{trans('backend::common.actions')}}
            <i class="fa fa-angle-down"></i>
        </a>
        <ul class="dropdown-menu pull-right">
            @foreach($actions as $action)
                <li>
                    <a rel="action-handler" href="{{$action->getAction()}}" data-entity="{{$entity->getMorphClass()}}" data-key="{{$entity->getKey()}}">
                        {{$action->getLabel()}}</a>
                </li>
            @endforeach
        </ul>
    </div>
@endif