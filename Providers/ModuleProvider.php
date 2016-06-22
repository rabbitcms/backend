<?php

namespace RabbitCMS\Backend\Providers;

use Illuminate\Auth\SessionGuard;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Carrot\Providers\ModuleProvider as CarrotModuleProvider;
use RabbitCMS\Carrot\Repository\BackendAcl;
use RabbitCMS\Carrot\Repository\BackendMenu;

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

        \BackendAcl::addAclResolver(
            function (BackendAcl $acl) {
                $acl->addGroup('system', trans('backend::acl.system.title'));
                $acl->addAcl('system', 'users.read', trans('backend::acl.users.read'));
                $acl->addAcl('system', 'users.write', trans('backend::acl.users.write'));
                $acl->addAcl('system', 'groups.read', trans('backend::acl.groups.read'));
                $acl->addAcl('system', 'groups.write', trans('backend::acl.groups.write'));
            }
        );

        \BackendMenu::addMenuResolver(
            function (BackendMenu $menu) {
                $menu->addItem(null, 'system', trans('backend::menu.system'), null, 'icon-settings', null, 100000);
                $menu->addItem('system', 'users', trans('backend::menu.users'), relative_route('backend.backend.users'), 'fa-angle-double-right', ['system.users.read'], 10);
                $menu->addItem('system', 'groups', trans('backend::menu.groups'), relative_route('backend.backend.groups'), 'fa-angle-double-right', ['system.groups.read'], 20);
            }
        );
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

}
