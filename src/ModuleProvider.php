<?php
declare(strict_types=1);
namespace RabbitCMS\Backend;

use Illuminate\Config\Repository as ConfigRepository;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Foundation\Application;
use Illuminate\Routing\Router;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use RabbitCMS\Backend\Console\Commands\MakeConfigCommand;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Backend\Facades\Backend as BackendFacade;
use RabbitCMS\Backend\Http\Controllers\Backend\Auth as AuthController;
use RabbitCMS\Backend\Http\Controllers\Backend\Main;
use RabbitCMS\Backend\Http\Middleware\Authenticate;
use RabbitCMS\Backend\Http\Middleware\AuthenticateWithBasicAuth;
use RabbitCMS\Backend\Http\Middleware\BackendVerifyCsrfToken;
use RabbitCMS\Backend\Http\Middleware\SetBackendGuard;
use RabbitCMS\Backend\Http\Middleware\StartSession;
use RabbitCMS\Backend\Support\Backend;
use RabbitCMS\Modules\Managers\Modules;
use RabbitCMS\Modules\Module;
use RabbitCMS\Modules\ModuleProvider as BaseModuleProvider;

/**
 * Class ModuleProvider
 * @package RabbitCMS\Backend
 */
class ModuleProvider extends BaseModuleProvider
{
    /**
     * Boot the application events.
     *
     * @param ConfigRepository $config
     * @param Router $router
     * @param Modules $modules
     */
    public function boot(ConfigRepository $config, Router $router, Modules $modules)
    {
        $config->set('auth.guards.backend', [
            'driver' => 'session',
            'provider' => 'backend',
        ]);

        $config->set('auth.providers.backend', [
            'driver' => 'eloquent',
            'model' => UserEntity::class,
        ]);

        $modules->enabled()->each(function (Module $module) use ($router) {
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

        $this->loadRoutes(function (Router $router) use ($modules) {
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
                    $modules->loadRoutes('backend', function (Module $module, array $options) {
                        return array_merge($options, ['prefix' => $module->config('backend.path', $module->getName())]);
                    });

                    $router->get('', ['uses' => Main::class.'@index', 'as' => 'backend.index']);
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
            SetBackendGuard::class,
            EncryptCookies::class,
            AddQueuedCookiesToResponse::class,
            StartSession::class,
            ShareErrorsFromSession::class,
            BackendVerifyCsrfToken::class
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
