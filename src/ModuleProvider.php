<?php
declare(strict_types=1);

namespace RabbitCMS\Backend;

use Illuminate\Config\Repository as ConfigRepository;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use RabbitCMS\Backend\Console\Commands\MakeConfigCommand;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Backend\Facades\Backend as BackendFacade;
use RabbitCMS\Backend\Factory\ActionsFactory;
use RabbitCMS\Backend\Factory\TabsFactory;
use RabbitCMS\Backend\Http\Controllers\Backend\Auth as AuthController;
use RabbitCMS\Backend\Http\Controllers\Backend\Main;
use RabbitCMS\Backend\Http\Middleware\Authenticate;
use RabbitCMS\Backend\Http\Middleware\AuthenticateWithBasicAuth;
use RabbitCMS\Backend\Http\Middleware\SetBackendGuard;
use RabbitCMS\Backend\Http\Middleware\StartSession;
use RabbitCMS\Backend\Support\Backend;
use RabbitCMS\Modules\Concerns\BelongsToModule;
use RabbitCMS\Modules\Facades\Modules;
use RabbitCMS\Modules\Module;

/**
 * Class ModuleProvider
 *
 * @package RabbitCMS\Backend
 */
class ModuleProvider extends ServiceProvider
{
    use BelongsToModule;

    /**
     * @var Application
     */
    protected $app;

    /**
     * Boot the application events.
     *
     * @param ConfigRepository $config
     * @param Router           $router
     */
    public function boot(ConfigRepository $config, Router $router)
    {
        $config->set('auth.guards.backend', [
            'driver' => 'session',
            'provider' => 'backend',
        ]);

        $config->set('auth.providers.backend', [
            'driver' => 'eloquent',
            'model' => UserEntity::class,
        ]);

        array_map(function (Module $module) use ($router) {
            $path = $module->getPath('config/backend.php');
            if (file_exists($path)) {
                $value = require_once($path);
                if (is_callable($value)) {
                    $this->app->call($value, ['module' => $module]);
                } elseif (is_array($value) && array_key_exists('boot', $value) && is_callable($value['boot'])) {
                    $this->app->call($value['boot'], ['module' => $module]);
                }
            }
        }, Modules::enabled());

        if (!$this->app->routesAreCached()) {
            Route::group([
                'prefix' => static::module()->config('path'),
                'domain' => static::module()->config('domain'),
                'middleware' => ['backend']
            ], function (Router $router) {
                $auth = AuthController::class;
                $router->get('auth/login', ['uses' => "{$auth}@getLogin", 'as' => 'backend.auth']);
                $router->post('auth/login', ['uses' => "{$auth}@postLogin", 'as' => 'backend.auth.login']);
                $router->get('auth/logout', ['uses' => "{$auth}@getLogout", 'as' => 'backend.auth.logout']);

                $router->group(['middleware' => ['backend.auth']], function (Router $router) {
                    Modules::loadRoutes('backend');
                    $router->get('', ['uses' => Main::class . '@index', 'as' => 'backend.index']);
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
        $this->app->singleton('backend.actions', function () {
            $user = Auth::user();
            return new ActionsFactory($user instanceof User ? $user : null);
        });
        $this->app->alias('backend.actions', ActionsFactory::class);

        $this->app->singleton('backend.tabs', function () {
            $user = Auth::user();
            return new TabsFactory($user instanceof User ? $user : null);
        });
        $this->app->alias('backend.tabs', TabsFactory::class);

        $this->app->singleton(Backend::class, function () {
            return new Backend($this->app);
        });

        $this->commands(MakeConfigCommand::class);

        // Register the middleware with the container using the container's singleton method.
        $this->app->singleton(StartSession::class);

        $router = $this->app->make('router');
        array_map(function (string $middleware) use ($router) {
            $router->pushMiddlewareToGroup('backend', $middleware);
        }, [
            SetBackendGuard::class,
            EncryptCookies::class,
            AddQueuedCookiesToResponse::class,
            StartSession::class,
            ShareErrorsFromSession::class,
//            VerifyCsrfToken::class
        ]);

        $this->app->make('router')->aliasMiddleware('backend.auth', Authenticate::class);
        $this->app->make('router')->aliasMiddleware('backend.auth.base', AuthenticateWithBasicAuth::class);

        AliasLoader::getInstance(['Backend' => BackendFacade::class]);
        $this->registerViewsDirectives();
    }

    protected function registerViewsDirectives(): void
    {
        $this->app->afterResolving('blade.compiler', function (BladeCompiler $compiler) {
            $compiler->directive('tabs', function ($expression) {
                return "<?php echo \RabbitCMS\Backend\Facades\Tabs::show({$expression}, \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path'))); ?>";
            });
            $compiler->directive('actions', function ($expression) {
                return "<?php echo \RabbitCMS\Backend\Facades\Actions::show({$expression}); ?>";
            });
        });
    }
}
