<?php

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Modules\ModuleController;

abstract class Controller extends ModuleController
{
    protected $module = 'backend';

    protected $denyView = 'backend::deny';

    public function __construct(Application $app)
    {
        parent::__construct($app);
    }

    /**
     * Get current user.
     *
     * @return User|null
     */
    protected function user()
    {
        return $this->auth()->user();
    }

    /**
     * Get backend auth guard.
     *
     * @return StatefulGuard
     */
    protected function auth()
    {
        return Auth::guard('backend');
    }
}
