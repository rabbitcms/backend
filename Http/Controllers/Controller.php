<?php

namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Auth\AuthManager;
use Illuminate\Foundation\Application;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Carrot\Http\ModuleController;

abstract class Controller extends ModuleController
{
    protected $module = 'backend';

    /**
     * @var \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
     */
    protected $auth;

    protected $denyView = 'backend::deny';

    public function __construct(Application $app, AuthManager $auth)
    {
        $this->auth = $auth->guard('backend');
        parent::__construct($app);
    }

    /**
     * Get current user.
     *
     * @return User|null
     */
    protected function user()
    {
        return $this->auth->user();
    }
}
