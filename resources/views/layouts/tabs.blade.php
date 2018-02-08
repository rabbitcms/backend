<?php
declare(strict_types=1);

use RabbitCMS\Backend\Support\Tab;

/* @var Tab[] $_tabs */
?>
@if(\count($_tabs) === 1)
    <div @if($_tabs[0]->getExec()) data-require="{{$_tabs[0]->getExec()}}" @endif>
        @include($_tabs[0]->getView())
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
                     @if($tab->getExec()) data-require{{$index ? '-lazy' : ''}}="{{$tab->getExec()}}" @endif>
                    @include($tab->getView())
                </div>
            @endforeach
        </div>
    </div>
@endif