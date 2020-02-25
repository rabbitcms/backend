<?php

declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Auth\AuthManager;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\App;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Modules\Concerns\BelongsToModule;
use Illuminate\Routing\Controller as IlluminateController;

/**
 * Class Controller
 */
abstract class Controller extends IlluminateController
{
    use BelongsToModule;

    protected $denyView = 'backend::deny';

    protected $title = 'Адміністрування';

    public function __construct()
    {
        \Illuminate\Support\Facades\View::composer('*', function (View $view) {
            $view->with([
                'title' => $this->title,
            ]);
        });
    }

    /**
     * @return StatefulGuard
     */
    protected function guard(): StatefulGuard
    {
        return App::make(AuthManager::class)->guard('backend');
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
     * @param  string  $message
     * @param  string  $type
     * @param  int  $code
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
     * @param  string  $message
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function success(string $message)
    {
        $this->message($message, 'success', 202);
    }

    /**
     * @param  string  $message
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function error(string $message)
    {
        $this->message($message, 'danger', 418);
    }

    /**
     * Execute an action on the controller.
     *
     * @param  string  $method
     * @param  array  $parameters
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function callAction($method, $parameters)
    {
        if (method_exists($this, 'init')) {
            App::call([$this, 'init']);
        }

        if (method_exists($this, 'before')) {
            App::call([$this, 'before'], ['method' => $method]);
        }

        $response = Router::toResponse(request(), parent::callAction($method, $parameters));
        $response->headers->set('X-Title', rawurlencode($this->title));

        return $response;
    }

    /**
     * @param  string  $path
     *
     * @return string
     */
    public function asset($path)
    {
        return static::module()->asset($path);
    }

    /**
     * @param  string  $key
     * @param  array  $parameters
     * @param  null  $locale
     *
     * @return array|null|string
     */
    public function trans($key, array $parameters = [], $locale = null)
    {
        return static::module()->trans($key, $parameters, $locale);
    }

    /**
     * @param  string  $view
     * @param  array  $data
     *
     * @return View
     */
    protected function view($view, array $data = []): View
    {
        return static::module()->view($view, $data);
    }

    /**
     * Get module view name.
     *
     * @param  string  $view
     *
     * @return string
     */
    protected function viewName($view): string
    {
        return static::module()->viewName($view);
    }
}
