<?php

use RabbitCMS\Backend\Support\Action;

/* @var Action[] $_actions */
/* @var object $object */
if (\count($_actions) === 0) return;
$_action = $_actions[0];
$actions_action_link = function (Action $action, $object) use ($__env)
{
    $attributes = [
        'class="btn btn-default btn-sm"'
    ];
    foreach ($action->getData($object) as $key => $value) {
        $attributes[] = 'data-' . $key . '="' . htmlentities($value) . '"';
    }
    $a = explode(':', $action->getExec(), 2);
    switch ($a[0]) {
        case 'modal':
            $attributes[] = 'data-toggle="modal"';
            $attributes[] = "data-target=\"#{$a[1]}\"";
            break;
        case 'portlet':
            $attributes[] = 'rel="ajax-portlet"';
            $attributes[] = "href=\"#{$a[1]}\"";
            break;
        default:
            $attributes[] = "href=\"#{$action->getExec()}\"";
    }
    $attributes = implode(' ', $attributes);
    echo "<a {$attributes}>";
    if ($action->getIcon()) echo "<i class=\"fa fa-{$action->getIcon()}\"></i> ";
    echo "{$action->getLabel()}</a>";
    ?>@push('modal')@includeIf($action->getView())@endpush<?php
}?>
<div class="actions">
    @if (\count($_actions) === 1)
        <?php $actions_action_link($_action, $object);?>
    @else
        <div class="btn-group">
            <button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown"
                    aria-expanded="true">
                Actions <i class="fa fa-angle-down"></i></button>
            <ul class="dropdown-menu pull-right">
                @foreach($_actions as $_action)
                    <li><?php $actions_action_link($_action, $object);?></li>
                @endforeach
            </ul>
        </div>
    @endif
</div>