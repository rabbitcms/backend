<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth as AuthFacade;
use Illuminate\Support\Facades\View as ViewFacade;
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

    /**
     * @param string $path
     *
     * @return string
     */
    public function asset($path): string
    {
        return static::module()->asset($path);
    }

    /**
     * @param string      $key
     * @param array       $parameters
     * @param string|null $locale
     *
     * @return array|null|string
     */
    public function trans(string $key, array $parameters = [], string $locale = null)
    {
        return static::module()->trans($key, $parameters, $locale);
    }

    /**
     * @param string $view
     * @param array  $data
     *
     * @return View
     */
    protected function view($view, array $data = []): View
    {
        return ViewFacade::make(static::module()->viewName($view), $data, []);
    }

    /**
     * Get module view name.
     *
     * @param string $view
     *
     * @return string
     */
    protected function viewName($view): string
    {
        return static::module()->viewName($view);
    }
}
