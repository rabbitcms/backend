<?php

namespace RabbitCMS\Backend\Providers;

use Illuminate\Auth\SessionGuard;
use Illuminate\Config\Repository as ConfigRepository;
use Illuminate\Routing\Router;
use Pingpong\Modules\Module;
use Pingpong\Modules\Repository as ModulesRepository;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Backend\Http\Controllers\Auth as AuthController;
use RabbitCMS\Carrot\Providers\ModuleProvider as CarrotModuleProvider;

class ModuleProvider extends CarrotModuleProvider
{
    /**
     * Boot the application events.
     *
     * @return void
     */
    public function boot(ConfigRepository $config, Router $router, ModulesRepository $modules)
    {
        $this->app->make('config')->set('auth.guards.backend', [
            'driver' => 'session',
            'provider' => 'backend',
        ]);

        $this->app->make('config')->set('auth.providers.backend', [
            'driver' => 'eloquent',
            'model' => UserEntity::class,
        ]);

        array_map(
            function (Module $module) use ($router) {
                $path = $module->getExtraPath('Config/backend.php');
                if (file_exists($path)) {
                    $value = require_once($path);
                    if (is_callable($value)) {
                        $this->app->call($value);
                    } elseif (is_array($value)) {
                        if (array_key_exists('boot', $value) && is_callable($value['boot'])) {
                            $this->app->call($value['boot']);
                        }
                    }
                }
            }, $modules->enabled()
        );

        $router->group([
            'as' => 'backend.',
            'prefix' => $config->get('module.backend.path'),
            'domain' => $config->get('module.backend.domain'),
            'middleware' => ['backend']
        ], function (Router $router) use ($modules) {

            $router->get('auth/login', ['uses' => AuthController::class . '@getLogin', 'as' => 'auth']);
            $router->post('auth/login', ['uses' => AuthController::class . '@postLogin', 'as' => 'auth.login']);
            $router->get('auth/logout', ['uses' => AuthController::class . '@getLogout', 'as' => 'auth.logout']);

            $router->group(['middleware' => ['backend.auth']], function (Router $router) use ($modules) {

                $router->get('', ['uses' => function () {
                    return view('backend::index');
                }, 'as' => 'index']);

                array_map(
                    function (Module $module) use ($router) {
                        $path = $module->getExtraPath('Config/backend.php');
                        if (file_exists($path)) {
                            $router->group(
                                [
                                    'prefix' => $module->getAlias(),
                                    'as' => $module->getAlias() . '.',
                                ],
                                function (Router $router) use ($path) {
                                    $value = require($path); //todo cache module backend config
                                    if (is_array($value)) {
                                        if (array_key_exists('routes', $value) && is_callable($value['routes'])) {
                                            $this->app->call($value['routes'], ['router' => $router]);
                                        }
                                    }
                                }
                            );
                        }
                    }, $modules->enabled()
                );
            });
        });
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        parent::register();

        $this->app->make('auth')->extend('backend', function () {
            $provider = $this->app->make('auth')->createUserProvider('backend');

            $guard = new SessionGuard('backend', $provider, $this->app->make('session.store'));

            // When using the remember me functionality of the authentication services we
            // will need to be set the encryption instance of the guard, which allows
            // secure, encrypted cookie values to get generated for those cookies.
            if (method_exists($guard, 'setCookieJar')) {
                $guard->setCookieJar($this->app->make('cookie'));
            }

            if (method_exists($guard, 'setDispatcher')) {
                $guard->setDispatcher($this->app->make('events'));
            }

            if (method_exists($guard, 'setRequest')) {
                $guard->setRequest($this->app->refresh('request', $guard, 'setRequest'));
            }

            return $guard;
        });

        $this->app->make('router')->middlewareGroup('backend', [
            //\Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            //\Illuminate\Session\Middleware\StartSession::class,
            //\Illuminate\View\Middleware\ShareErrorsFromSession::class,
            // \RabbitCMS\Carrot\Http\Middleware\VerifyCsrfToken::class,
            //\RabbitCMS\Backend\Http\Middleware\Authenticate::class,
        ]);
        $this->app->make('router')->middleware('backend.auth', \RabbitCMS\Backend\Http\Middleware\Authenticate::class);
        $this->app->make('router')->middleware('backend.auth.base', \RabbitCMS\Backend\Http\Middleware\AuthenticateWithBasicAuth::class);
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    protected function name()
    {
        return 'backend';
    }

}
