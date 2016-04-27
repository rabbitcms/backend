<ul class="page-sidebar-menu" data-auto-scroll="true" data-slide-speed="200">
    @foreach(\BackendMenu::getMenu() as $menu => $item)
        <li @if(\RabbitCMS\Backend\Support\Metronic::isMenu($menu)) class="active open" @endif>
            <a @if(isset($item['link'])) href="{{$item['link']}}" @else href="javascript:void(0);" @endif @if(empty($item['items'])) rel="ajax-portlet" @endif>
                <i class="fa {{$item['icon']}}"></i>
                <span class="title">{{$item['label']}}</span>
                @if (!empty($item['items']))
                    <span class="arrow @if(\RabbitCMS\Backend\Support\Metronic::isMenu($menu)) open @endif"></span>
                @endif
            </a>
            @if(!empty($item['items']))
                <ul class="sub-menu">
                    @foreach($item['items'] as $subitem)
                        <li @if(\RabbitCMS\Backend\Support\Metronic::isMenu($menu, $subitem['menu'])) class="active" @endif>
                            <a @if(isset($subitem['link'])) href="{{$subitem['link']}}" rel="ajax-portlet" @else href="javascript:void(0);" @endif>
                                <i class="fa {{$subitem['icon']}}"></i>
                                <span class="title">{{$subitem['label']}}</span>
                            </a>
                        </li>
                    @endforeach
                </ul>
            @endif
        </li>
    @endforeach
</ul>