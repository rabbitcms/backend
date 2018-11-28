<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Providers;

use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Foundation\Application;
use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Backend\Support\Backend;

/**
 * Class AclToGateProvider.
 * @package RabbitCMS\Backend
 */
class AclToGateProvider extends LaravelServiceProvider
{
    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->app->booted(function () {
            $this->app->extend(Gate::class, function (Gate $gate, Application $app) {
                foreach ($app->make(Backend::class)->getAllAcl() as $acl => $label) {
                    $gate->define($acl, function ($user) use ($acl) {
                        return $user instanceof User ? $user->hasAccess($acl) : false;
                    });
                }
                return $gate;
            });
        });
    }
}
