<?php

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Auth\AuthManager;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Foundation\Application;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Modules\ModuleController;


abstract class Controller extends ModuleController
{
    protected $module = 'backend';

    protected $denyView = 'backend::deny';

    public function __construct(Application $app, AuthManager $auth)
    {
        parent::__construct($app);
    }

    /**
     * @return StatefulGuard
     */
    protected function guard():StatefulGuard
    {
        return $this->app->make(AuthManager::class)->guard('backend');
    }

    /**
     * Get current user.
     *
     * @return User|null
     */
    protected function user()
    {
        return $this->guard()->user();
    }
}