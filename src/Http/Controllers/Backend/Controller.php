<?php
namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Auth\AuthManager;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\JsonResponse;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Modules\ModuleController;

/**
 * Class Controller
 */
abstract class Controller extends ModuleController
{
    protected $module = 'backend';

    protected $denyView = 'backend::deny';

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

    /**
     * Return message response.
     *
     * @param string $message
     * @param string $type
     * @param int    $code
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function message(string $message, string $type = 'danger', int $code = 418)
    {
        (new JsonResponse(
            ['message' => $message, 'type' => $type],
            $code,
            [],
            JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        ))->throwResponse();
    }

    /**
     * @param string $message
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function success(string $message)
    {
        $this->message($message, 'success', 202);
    }

    /**
     * @param string $message
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function error(string $message)
    {
        $this->message($message, 'danger', 418);
    }
}
