<?php
namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Auth\AuthManager;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Foundation\Application;
use Illuminate\Http\Exception\HttpResponseException;
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
     * Controller constructor.
     *
     * @param Application $app
     * @param AuthManager $auth
     */
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

    /**
     * Return message response.
     *
     * @param string $message
     * @param string $type
     * @param int    $code
     *
     * @throws HttpResponseException
     */
    protected function message(string $message, string $type = 'danger', int $code = 418)
    {
        throw new HttpResponseException(
            \Response::json(
                ['message' => $message, 'type' => $type],
                $code,
                [],
                JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
            )
        );
    }

    /**
     * @param string $message
     *
     * @throws HttpResponseException
     */
    protected function success(string $message)
    {
        $this->message($message, 'success', 202);
    }

    /**
     * @param string $message
     *
     * @throws HttpResponseException
     */
    protected function error(string $message)
    {
        $this->message($message, 'danger', 418);
    }
}
