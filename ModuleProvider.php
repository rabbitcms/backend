<?php

namespace RabbitCMS\Backend;

use Illuminate\Config\Repository as ConfigRepository;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Router;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use RabbitCMS\Backend\Console\Commands\MakeConfigCommand;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Backend\Facades\Backend as BackendFacade;
use RabbitCMS\Backend\Http\Controllers\Backend\Auth as AuthController;
use RabbitCMS\Backend\Http\Middleware\Authenticate;
use RabbitCMS\Backend\Http\Middleware\AuthenticateWithBasicAuth;
use RabbitCMS\Backend\Http\Middleware\BackendVerifyCsrfToken;
use RabbitCMS\Backend\Http\Middleware\SetBackendGuard;
use RabbitCMS\Backend\Http\Middleware\StartSession;
use RabbitCMS\Backend\Support\Backend;
use RabbitCMS\Modules\Contracts\ModulesManager;
use RabbitCMS\Modules\Module;
use RabbitCMS\Modules\ModuleProvider as BaseModuleProvider;

class ModuleProvider extends BaseModuleProvider
{
    /**
     * Boot the application events.
     *
     * @param ConfigRepository $config
     * @param Router $router
     * @param ModulesManager $modules
     */
    public function boot(ConfigRepository $config, Router $router, ModulesManager $modules)
    {
        $this->app->make('config')->set('auth.guards.backend', [
            'driver' => 'session',
            'provider' => 'backend',
        ]);

        $this->app->make('config')->set('auth.providers.backend', [
            'driver' => 'eloquent',
            'model' => UserEntity::class,
        ]);

        $modules->enabled()->each(function (Module $module) use ($router) {
            $path = $module->getPath('Config/backend.php');
            if (file_exists($path)) {
                $value = require_once($path);
                if (is_callable($value)) {
                    $this->app->call($value);
                } elseif (is_array($value) && array_key_exists('boot', $value) && is_callable($value['boot'])) {
                    $this->app->call($value['boot']);
                }
            }
        });

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

                $modules->enabled()->each(function (Module $module) use ($router) {
                    if (file_exists($path = $module->getPath('routes/backend.php'))) {
                        $call = function (Router $router) use ($path) {
                            require $path;
                        };
                    } elseif (file_exists($path = $module->getPath('Config/backend.php'))) {
                        $call = function (Router $router) use ($path) {
                            $value = require $path;
                            if (is_array($value)
                                && array_key_exists('routes', $value)
                                && is_callable($value['routes'])) {
                                    $this->app->call($value['routes'], ['router' => $router]);
                            }
                        };
                    } else {
                        return;
                    }

                    $router->group([
                        'prefix' => $module->getName(),
                        'as' => $module->getName() . '.',
                        'namespace' => $module->getNamespace() . '\\Http\\Controllers\\Backend'
                    ], $call);
                });
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

        $this->app->singleton(Backend::class, function () {
            return new Backend($this->app);
        });

        $this->commands(MakeConfigCommand::class);

        // Register the middleware with the container using the container's singleton method.
        $this->app->singleton(StartSession::class);

        $this->app->make('router')
            ->middlewareGroup('backend', [
                SetBackendGuard::class,
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                ShareErrorsFromSession::class,
                BackendVerifyCsrfToken::class
            ]);


        $this->app->make('router')->middleware('backend.auth', Authenticate::class);
        $this->app->make('router')->middleware('backend.auth.base', AuthenticateWithBasicAuth::class);


        AliasLoader::getInstance(['Backend'=> BackendFacade::class]);
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
