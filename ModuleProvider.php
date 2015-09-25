<?php namespace RabbitCMS\Backend;

use Illuminate\Routing\Router;
use RabbitCMS\Backend\Support\BackendAcl;
use RabbitCMS\Carrot\Support\ModuleProvider as BaseModuleProvider;
use RabbitCMS\Backend\Http\Middleware\Authenticate;
use RabbitCMS\Backend\Facades\BackendAcl as BackendAclFacade;

class ModuleProvider extends BaseModuleProvider
{

    protected $aliases = [
        'BackendAcl' => BackendAclFacade::class
    ];

    public function register()
    {
        $this->app->bind('backend.acl', function () {
            return new BackendAcl();
        }, true);
        parent::register();
    }

    public function routes(Router $router)
    {
        $router->middleware('backend.auth', Authenticate::class);

        $backendGroup = \Config::get('cms.backend');
        if (array_key_exists('domain', $backendGroup)) {
            $domain = config('app.domain');
            $backendGroup['domain'] = str_replace('{$domain}', $domain, $backendGroup['domain']);
        }
        $router->group($backendGroup, function (Router $router) {
            $router->controller('auth', Http\Controllers\Auth::class);
            $router->group(['middleware' => ['backend.auth']], function (Router $router) {
                array_map(function (BaseModuleProvider $module) use ($router) {
                    if (method_exists($module, 'backendRoutes')) {
                        $group = $module->config('backend', []);
                        $group['as'] = $module->name.'.';
                        $group['namespace'] = '\\' . $module->getNamespace() . 'Http\\Controllers\\Backend';
                        $router->group($group, function (Router $router) use ($module) {
                            $module->backendRoutes($router);
                        });
                    }
                }, $this->app->make('module.loader')->getModules());
            });

        });
    }

    public function backendRoutes(Router $router)
    {

    }
}