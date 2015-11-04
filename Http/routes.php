<?php

use \Illuminate\Routing\Router;

Route::middleware('backend.auth', \RabbitCMS\Backend\Http\Middleware\Authenticate::class);

$backendGroup = \Config::get('cms.backend');
if (array_key_exists('domain', $backendGroup)) {
    $domain = config('app.domain');
    $backendGroup['domain'] = str_replace('{$domain}', $domain, $backendGroup['domain']);
}
$backendGroup['as'] = 'backend.';
Route::group($backendGroup, function (Router $router) {

    $router->controller('auth', \RabbitCMS\Backend\Http\Controllers\Auth::class, [
        'getLogin' => 'auth',
        'postLogin' => 'auth.login',
        'getLogout' => 'auth.logout'
    ]);

    $router->group(['middleware' => ['backend.auth']], function (Router $router) {
        array_map(function (\Pingpong\Modules\Module $module) use ($router) {
            if (file_exists($path = $module->getExtraPath('Http/backend.php'))) {
                $group = [
                    'prefix' => $module->getAlias(),
                    'as' => $module->getAlias() . '.',
                ];
                $router->group($group, function (Router $router) use ($path) {
                    require($path);
                });
            }
        }, Module::getByStatus(1));
    });
});