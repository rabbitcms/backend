@foreach($items as $item)
    <li data-path="{{$item['path']}}" class="nav-item @if($menu->isActiveMenu($item)) active open @endif">
        <a href="{{$item['url'] ?: 'javascript:;'}}" class="nav-link nav-toggle" @if(count($item['items']) === 0) rel="ajax-portlet" @endif>
            @if($item['icon'])
                <i class="fa {{$item['icon']}}"></i>
            @endif
                <span class="title">{{$item['caption']}}</span>
            @if(count($item['items']))
                <span class="arrow @if($menu->isActiveMenu($item)) open @endif"></span>
            @endif
            @if($menu->isActiveMenu($item))
                <span class="selected"></span>
            @endif
        </a>
        @if(count($items = $item['items']))
            <ul class="sub-menu">
                @include('backend::layouts.sidebar-items')
            </ul>
        @endif
    </li>
@endforeach