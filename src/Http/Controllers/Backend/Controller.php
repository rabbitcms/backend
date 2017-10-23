<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth as AuthFacade;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Modules\Concerns\BelongsToModule;

/**
 * Class Controller
 *
 * @package RabbitCMS\Backend\Http\Controllers\Backend
 */
abstract class Controller extends \Illuminate\Routing\Controller
{
    use BelongsToModule;

    protected $denyView = 'backend::deny';

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
     * @return StatefulGuard
     */
    protected function guard(): StatefulGuard
    {
        return AuthFacade::guard('backend');
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
            new JsonResponse([
                'message' => $message,
                'type'    => $type,
            ], $code, [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
        );
    }

    /**
     * @param string $message
     */
    protected function success(string $message)
    {
        $this->message($message, 'success', 202);
    }

    /**
     * @param string $message
     */
    protected function error(string $message)
    {
        $this->message($message, 'danger', 418);
    }

    /**
     * @param string $method
     * @param array  $parameters
     *
     * @return mixed|\Symfony\Component\HttpFoundation\Response
     */
    public function callAction($method, $parameters)
    {
        $this->before();

        return parent::callAction($method, $parameters);
    }

    /**
     * Call before call the action.
     */
    protected function before(): void
    {
    }
}
