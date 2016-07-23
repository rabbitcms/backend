<?php

use Illuminate\Routing\Router;

Route::group(
    [
        'prefix' => 'media',
        'where' => [
            'h' => '[a-f0-9]{2}',
            'h2' => '[a-f0-9]{2}',
            'hash' => '[a-f0-9]{32}',
            'id' => '\d+',
            'type' => 'r|c',
            'width' => '(\d+|-)',
            'height' => '(\d+|-)',
            'ext' => 'jpg|png|pdf|doc|docx|xls|xlsx|rtf|zip',
        ],
    ],
    function (Router $router) {
        $router->get('{h}/{h2}/{id}-{hash}.{ext}', '\RabbitCMS\Backend\Http\Controllers\MediaController@image');
        $router->get('{h}/{h2}/{id}-{hash}_{type}{width}x{height}.{ext}', '\RabbitCMS\Backend\Http\Controllers\MediaController@resize');
    }
);
