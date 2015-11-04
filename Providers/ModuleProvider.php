<?php namespace RabbitCMS\Backend\Providers;

use Illuminate\Support\ServiceProvider;
use RabbitCMS\Backend\Support\BackendAcl;
use RabbitCMS\Backend\Support\BackendMenu;

class ModuleProvider extends ServiceProvider
{

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
        $this->registerConfig();
        $this->registerTranslations();
        $this->registerViews();
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('backend.acl', function () {
            return new BackendAcl();
        }, true);

        $this->app->bind('backend.menu', function () {
            return new BackendMenu();
        }, true);
    }

    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->publishes([
            __DIR__ . '/../config/config.php' => config_path('modules/backend.php'),
        ]);
        $this->mergeConfigFrom(
            __DIR__ . '/../config/config.php', 'modules.backend'
        );
    }

    /**
     * Register views.
     *
     * @return void
     */
    public function registerViews()
    {
        $viewPath = base_path('resources/views/modules/backend');

        $sourcePath = __DIR__ . '/../resources/views';

        $this->publishes([
            $sourcePath => $viewPath
        ]);

        $this->loadViewsFrom([$viewPath, $sourcePath], 'backend');
    }

    /**
     * Register translations.
     *
     * @return void
     */
    public function registerTranslations()
    {
        $langPath = base_path('resources/lang/modules/backend');

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, 'backend');
        } else {
            $this->loadTranslationsFrom(__DIR__ . '/../resources/lang', 'backend');
        }
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return array('backend.acl','backend.menu');
    }

}
