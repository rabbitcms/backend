<?php

namespace RabbitCMS\Backend\Providers;

use Illuminate\Config\Repository as ConfigRepository;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Response;
use Illuminate\Routing\Router;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use RabbitCMS\Backend\Console\Commands\MakeConfigCommand;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Backend\Facades\Backend as BackendFacade;
use RabbitCMS\Backend\Http\Controllers\Backend\Auth as AuthController;
use RabbitCMS\Backend\Http\Middleware\Authenticate;
use RabbitCMS\Backend\Http\Middleware\AuthenticateWithBasicAuth;
use RabbitCMS\Backend\Http\Middleware\StartSession;
use RabbitCMS\Backend\Support\Backend;
use RabbitCMS\Backend\Support\ConfigMaker;
use RabbitCMS\Modules\Managers\Modules;
use RabbitCMS\Modules\Module;
use RabbitCMS\Modules\ModuleProvider;

class BackendModuleProvider extends ModuleProvider
{
    /**
     * Boot the application events.
     *
     * @param ConfigRepository $config
     * @param Router $router
     * @param Modules $modules
     * @param Dispatcher $dispatcher
     */
    public function boot(ConfigRepository $config, Router $router, Modules $modules, Dispatcher $dispatcher)
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
            'as' => 'backend.config.js',
            'domain' => $config->get('module.backend.domain'),
        ], function (Router $router) use ($dispatcher) {
            $router->get('backend/config.js', function () use ($dispatcher) {
                $response = new Response($dispatcher->dispatchNow(new ConfigMaker()), 200, [
                    'Content-Type' => 'application/javascript'
                ]);
                $response->headers->addCacheControlDirective('public');
                $response->headers->addCacheControlDirective('max-age', 60 * 60);
                return $response;
            });
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
                $router->get('', [
                    'uses' => function () {
                        return view('backend::index');
                    },
                    'as' => 'index'
                ]);

                $modules->enabled()->each(function (Module $module) use ($router) {
                    if (file_exists($path = $module->getPath('routes/backend.php'))) {
                        $router->group([
                            'prefix' => $module->getName(),
                            'as' => $module->getName() . '.',
                            'namespace' => $module->getNamespace() . '\\Http\\Controllers\\Backend'
                        ], function (Router $router) use ($path, $module) {
                            require $path;
                        });
                    }
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

        $this->app->make('router')->middlewareGroup('backend', [
            EncryptCookies::class,
            AddQueuedCookiesToResponse::class,
            StartSession::class,
            ShareErrorsFromSession::class,
            VerifyCsrfToken::class
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
    protected function name(): string
    {
        return 'backend';
    }
}
