<?php
declare(strict_types=1);
namespace RabbitCMS\Backend\Providers;

use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Backend\Support\Backend;

/**
 * Class AclToGateProvider
 *
 * @package RabbitCMS\Backend\Providers
 */
class AclToGateProvider extends LaravelServiceProvider
{
    /**
     * @inheritdoc
     */
    public function register()
    {
    }

    /**
     * Define acl as gate permissions.
     *
     * @param Backend $backend
     */
    public function boot(Backend $backend)
    {
        $this->app->afterResolving(Gate::class, function(Gate $gate) use ($backend) {
            foreach ($backend->getAllAcl() as $acl => $label) {
                $gate->define($acl, function ($user) use ($acl) {
                    return $user instanceof User ? $user->hasAccess($acl) : false;
                });
            }
        });
    }
}
