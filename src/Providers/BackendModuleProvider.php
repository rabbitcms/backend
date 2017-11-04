<?php
declare(strict_types=1);
namespace RabbitCMS\Backend\Providers;

use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Route;
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
use RabbitCMS\Modules\Concerns\BelongsToModule;
use RabbitCMS\Modules\Facades\Modules;
use RabbitCMS\Modules\ModuleProvider;

/**
 * Class BackendModuleProvider
 *
 * @package RabbitCMS\Backend\Providers
 * @property Application $app
 */
class BackendModuleProvider extends ModuleProvider
{
    use BelongsToModule;

    /**
     * Boot the application events.
     */
    public function boot()
    {
        $this->app->make('config')->set('auth.guards.backend', [
            'driver' => 'session',
            'provider' => 'backend',
        ]);

        $this->app->make('config')->set('auth.providers.backend', [
            'driver' => 'eloquent',
            'model' => UserEntity::class,
        ]);

        if (!$this->app->routesAreCached()) {
            Route::group([
                'prefix' => self::module()->config('path'),
                'domain' => self::module()->config('domain'),
                'middleware' => ['backend']
            ], function (Router $router) {
                $router->get('backend/config.js', Config::class.'@make')->name('backend.config.js');
                $auth = AuthController::class;
                $router->get('auth/login', ['uses' => "{$auth}@getLogin", 'as' => 'backend.auth']);
                $router->post('auth/login', ['uses' => "{$auth}@postLogin", 'as' => 'backend.auth.login']);
                $router->get('auth/logout', ['uses' => "{$auth}@getLogout", 'as' => 'backend.auth.logout']);

                $router->group(['middleware' => ['backend.auth']], function (Router $router) {
                    $router->get('', [
                        'uses' => Dashboard::class.'@index',
                        'as' => 'backend.index'
                    ]);
                    Modules::loadRoutes('backend');
                });
            });
        }
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

        $this->app->make('router')->aliasMiddleware('backend.auth', Authenticate::class);
        $this->app->make('router')->aliasMiddleware('backend.auth.base', AuthenticateWithBasicAuth::class);

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
