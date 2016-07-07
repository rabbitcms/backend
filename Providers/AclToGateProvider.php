<?php

namespace RabbitCMS\Backend\Providers;

use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
use RabbitCMS\Backend\Support\Backend;
use RabbitCMS\Carrot\Contracts\HasAccessEntity;

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
     * @param Gate $gate
     * @param Backend $backend
     */
    public function boot(Gate $gate, Backend $backend)
    {
        \App::booted(
            function () use ($gate, $backend) {
                foreach ($backend->getAllAcl() as $acl => $label) {
                    $gate->define(
                        $acl,
                        function (HasAccessEntity $user) use ($acl) {
                            return $user->hasAccess($acl);
                        }
                    );
                }
            }
        );
    }
}