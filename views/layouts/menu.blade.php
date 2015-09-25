<ul class="page-sidebar-menu " data-auto-scroll="true" data-slide-speed="200">
    @foreach(\BackendMenu::getMenu() as $menu => $item)
        <li {!!\RabbitCMS\Backend\Support\Metronic::isMenu($menu) ? 'class="open active"':''!!}>
            <a href="{{isset($item['link']) ? $item['link'] : 'javascript:;'}}">
                <i class="fa {{$item['icon']}}"></i>
                <span class="title">{{$item['label']}}</span>
                @if (!empty($item['items']))
                    <span class="arrow "></span>
                @endif
            </a>
            @if (!empty($item['items']))
                <ul class="sub-menu">
                    @foreach($item['items'] as $subitem)
                        <li {!!\Dtkt\Metronic::isMenu($menu, $subitem['menu']) ? 'class="active"':''!!}>
                            <a href="{{isset($subitem['link']) ? $subitem['link'] : 'javascript:;'}}">
                                <i class="fa {{$subitem['icon']}}"></i>
                                <span class="title">{{$subitem['label']}}</span>
                                @if (!empty($subitem['items']))
                                    <span class="arrow "></span>
                                @endif
                            </a>
                        </li>
                    @endforeach
                </ul>
            @endif
        </li>
    @endforeach
</ul>