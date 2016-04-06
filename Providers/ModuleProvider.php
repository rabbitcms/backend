<?php namespace RabbitCMS\Backend\Providers;

use Illuminate\Auth\SessionGuard;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Backend\Support\BackendAcl;
use RabbitCMS\Backend\Support\BackendMenu;
use RabbitCMS\Carrot\Providers\ModuleProvider as CarrotModuleProvider;

class ModuleProvider extends CarrotModuleProvider
{
    protected function name()
    {
        return 'backend';
    }

    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Boot the application events.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->make('config')->set('auth.guards.backend', [
            'driver'   => 'session',
            'provider' => 'backend',
        ]);

        $this->app->make('config')->set('auth.providers.backend', [
            'driver' => 'eloquent',
            'model'  => UserEntity::class,
        ]);

        \BackendAcl::addAcl('system.*', trans('backend::common.system'));
        \BackendAcl::addAcl('system.users.*', trans('backend::common.users'));
        \BackendAcl::addAcl('system.users.read', trans('backend::common.rules.read'));
        \BackendAcl::addAcl('system.users.write', trans('backend::common.rules.write'));
        \BackendAcl::addAcl('system.groups.*', trans('backend::common.groups'));
        \BackendAcl::addAcl('system.groups.read', trans('backend::common.rules.read'));
        \BackendAcl::addAcl('system.groups.write', trans('backend::common.rules.write'));

        $all = \BackendAcl::getModulePermissions('system');
        $users = \BackendAcl::getModulePermissions('system', 'users');
        $groups = \BackendAcl::getModulePermissions('system', 'groups');

        \BackendMenu::addMenu('system', trans('backend::common.system'), '', 'fa-gears', $all);
        \BackendMenu::addItem('system', 'users', trans('backend::common.users'), route('backend.backend.users'), 'fa-angle-double-right', $users);
        \BackendMenu::addItem('system', 'groups', trans('backend::common.groups'), route('backend.backend.groups'), 'fa-angle-double-right', $groups);
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
            \RabbitCMS\Carrot\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            // \RabbitCMS\Carrot\Http\Middleware\VerifyCsrfToken::class,
            //\RabbitCMS\Backend\Http\Middleware\Authenticate::class,
        ]);
        $this->app->make('router')->middleware('backend.auth', \RabbitCMS\Backend\Http\Middleware\Authenticate::class);
        $this->app->make('router')->middleware('backend.auth.base', \RabbitCMS\Backend\Http\Middleware\AuthenticateWithBasicAuth::class);

        $this->app->bind('backend.acl', function () {
            return new BackendAcl();
        }, true);

        $this->app->bind('backend.menu', function () {
            return new BackendMenu();
        }, true);

        $bower = $this->app->make('rabbitcms.bower');
        $bower->define('jquery', [], 'dist/dist/jquery.min.js');
        $bower->define('bootstrap', ['jquery'], 'js/bootstrap.min', ['css/bootstrap.css']);
        $bower->define('jquery.validate', ['jquery'], '../jquery-validation/dist/jquery.validate');
        $bower->define('jquery.validate.methods', ['jquery.validate'], '../jquery-validation/dist/additional-methods');
        $bower->define('tinymce', ['jquery'], 'tinymce.jquery.min');
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return ['backend.acl', 'backend.menu'];
    }

}
