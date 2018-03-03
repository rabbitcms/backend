<?php
declare(strict_types=1);

use RabbitCMS\Backend\Support\Tab;

/* @var Tab[] $_tabs */
/* @var object $object */
?>
@if(\count($_tabs) === 1)
    <div @if($exec = $_tabs[0]->getExec($object)) data-require="{{$exec}}" @endif>
        @include($_tabs[0]->getView($object), $data + $_tabs[0]->getData($object))
    </div>
@else
    <div class="tabbable-custom">
        <ul class="nav nav-tabs">
            @foreach($_tabs as $index => $tab)
                <li @if($index === 0)class="active"@endif>
                    <a href="#tab_{{$tab->getName()}}" data-toggle="tab">{{$tab->getLabel()}}</a>
                </li>
            @endforeach
        </ul>
        <div class="tab-content">
            @foreach($_tabs as $index => $tab)
                <div class="tab-pane @if($index === 0) active @endif" id="tab_{{$tab->getName()}}"
                     @if($exec = $tab->getExec($object)) data-require{{$index ? '-lazy' : ''}}="{{$exec}}" @endif>
                    @include($tab->getView($object), $data + $tab->getData($object))
                </div>
            @endforeach
        </div>
    </div>
@endif