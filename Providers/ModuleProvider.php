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
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        parent::register(); 

        $this->app->make('auth')->extend('backend', function ($config) {
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

        $this->app->bind('backend.acl', function () {
            return new BackendAcl();
        }, true);

        $this->app->bind('backend.menu', function () {
            return new BackendMenu();
        }, true);
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
