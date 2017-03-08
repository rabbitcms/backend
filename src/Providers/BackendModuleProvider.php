<?php
declare(strict_types=1);
namespace RabbitCMS\Backend\Providers;

use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Router;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use RabbitCMS\Backend\Console\Commands\MakeConfigCommand;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Backend\Facades\Backend as BackendFacade;
use RabbitCMS\Backend\Http\Controllers\Backend\Auth as AuthController;
use RabbitCMS\Backend\Http\Controllers\Backend\Config;
use RabbitCMS\Backend\Http\Controllers\Backend\Dashboard;
use RabbitCMS\Backend\Http\Middleware\Authenticate;
use RabbitCMS\Backend\Http\Middleware\AuthenticateWithBasicAuth;
use RabbitCMS\Backend\Http\Middleware\StartSession;
use RabbitCMS\Backend\Support\Backend;
use RabbitCMS\Modules\Managers\Modules;
use RabbitCMS\Modules\Module;
use RabbitCMS\Modules\ModuleProvider;

/**
 * Class BackendModuleProvider
 *
 * @package RabbitCMS\Backend\Providers
 */
class BackendModuleProvider extends ModuleProvider
{
    /**
     * Boot the application events.
     *
     * @param Modules $modules
     */
    public function boot(Modules $modules)
    {
        $this->app->make('config')->set('auth.guards.backend', [
            'driver' => 'session',
            'provider' => 'backend',
        ]);

        $this->app->make('config')->set('auth.providers.backend', [
            'driver' => 'eloquent',
            'model' => UserEntity::class,
        ]);

        $this->app->booted(function () use ($modules) {
            $modules->enabled()->each(function (Module $module) {
                $path = $module->getPath('config/backend.php');
                if (file_exists($path)) {
                    $value = require_once($path);
                    if (is_callable($value)) {
                        $this->app->call($value);
                    } elseif (is_array($value) && array_key_exists('boot', $value) && is_callable($value['boot'])) {
                        $this->app->call($value['boot']);
                    }
                }
            });
        });

        $this->loadRoutes(function (Router $router) use ($modules) {
            $router->get('backend/config.js', [
                'uses'=> Config::class.'@make',
                'as' => 'backend.config.js',
                'domain' => $this->module->config('domain')
            ]);

            $router->group([
                'prefix' => $this->module->config('path'),
                'domain' => $this->module->config('domain'),
                'middleware' => ['backend']
            ], function (Router $router) use ($modules) {
                $auth = AuthController::class;
                $router->get('auth/login', ['uses' => "{$auth}@getLogin", 'as' => 'backend.auth']);
                $router->post('auth/login', ['uses' => "{$auth}@postLogin", 'as' => 'backend.auth.login']);
                $router->get('auth/logout', ['uses' => "{$auth}@getLogout", 'as' => 'backend.auth.logout']);

                $router->group(['middleware' => ['backend.auth']], function (Router $router) use ($modules) {
                    $router->get('', [
                        'uses' => Dashboard::class.'@index',
                        'as' => 'backend.index'
                    ]);
                    $modules->loadRoutes('backend');
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

        if (version_compare(Application::VERSION, '5.4') === -1) {
            $this->app->make('router')->middleware('backend.auth', Authenticate::class);
            $this->app->make('router')->middleware('backend.auth.base', AuthenticateWithBasicAuth::class);
        } else {
            $this->app->make('router')->aliasMiddleware('backend.auth', Authenticate::class);
            $this->app->make('router')->aliasMiddleware('backend.auth.base', AuthenticateWithBasicAuth::class);
        }

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
