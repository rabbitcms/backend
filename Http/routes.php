<?php

use \Illuminate\Routing\Router;

Route::group(
    [
        'prefix' => 'media',
        'where'  => [
            'h'      => '[a-f0-9]{2}',
            'h2'     => '[a-f0-9]{2}',
            'hash'   => '[a-f0-9]{32}',
            'id'     => '\d+',
            'type'   => 'r|c',
            'width'  => '(\d+|-)',
            'height' => '(\d+|-)',
            'ext'    => 'jpg|png|pdf|doc|docx|xls|xlsx|rtf|zip',
        ],
    ],
    function (Router $router) {
        $router->get('{h}/{h2}/{id}-{hash}.{ext}', '\RabbitCMS\Backend\Http\Controllers\MediaController@image');
        $router->get('{h}/{h2}/{id}-{hash}_{type}{width}x{height}.{ext}', '\RabbitCMS\Backend\Http\Controllers\MediaController@resize');
    }
);


$backendGroup = \Config::get('cms.backend');
if (is_array($backendGroup) && array_key_exists('domain', $backendGroup)) {
    $domain = config('app.domain');
    $backendGroup['domain'] = str_replace('{$domain}', $domain, $backendGroup['domain']);
}
$backendGroup['as'] = 'backend.';
$backendGroup['middleware'] = ['backend'];
Route::group(
    $backendGroup, function (Router $router) {

    $router->controller(
        'auth', \RabbitCMS\Backend\Http\Controllers\Auth::class, [
            'getLogin'  => 'auth',
            'postLogin' => 'auth.login',
            'getLogout' => 'auth.logout',
        ]
    );

    $router->group(
        ['middleware' => ['backend.auth']], function (Router $router) {
        $router->get(
            '',
            [
                'uses' => function () {
                    return view('backend::layouts.master');
                },
                'as'   => 'index',
            ]
        );
        array_map(
            function (\Pingpong\Modules\Module $module) use ($router) {
                if (file_exists($path = $module->getExtraPath('Http/backend.php'))) {
                    $group = [
                        'prefix' => $module->getAlias(),
                        'as'     => $module->getAlias().'.',
                    ];
                    $router->group(
                        $group,
                        function (Router $router) use ($path) {
                            require($path);
                        }
                    );
                }
            },
            Module::enabled()
        );
    }
    );
}
);