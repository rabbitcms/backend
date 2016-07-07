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

Route::group([
    'as' => 'backend.',
    'prefix' => config('module.backend.path'),
    'domain' => config('module.backend.domain'),
    'middleware' => ['backend','backend.auth']
], function (Router $router) {
    array_map(
        function (\Pingpong\Modules\Module $module) use ($router) {
            if (file_exists($path = $module->getExtraPath('Http/backend.php'))) {
                $router->group([
                    'prefix' => $module->getAlias(),
                    'as' => $module->getAlias() . '.',
                ], function (Router $router) use ($path) {
                    require($path);
                });
            }
        }, Module::enabled()
    );
});