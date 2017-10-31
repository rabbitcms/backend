<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Middleware;

use Closure;
use Doctrine\Common\Annotations\AnnotationReader;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\View;
use RabbitCMS\Backend\Annotation\Permissions as PermissionAnnotation;
use RabbitCMS\Backend\Contracts\HasAccessEntity;
use RabbitCMS\Modules\Concerns\BelongsToModule;
use ReflectionClass;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use URL;

/**
 * Class Authenticate
 *
 * @package RabbitCMS\Backend\Http\Middleware
 */
class Authenticate
{
    use BelongsToModule;

    /**
     * The Guard implementation.
     *
     * @var Guard
     */
    protected $guard;

    /**
     * Create a new filter instance.
     *
     * @param  AuthFactory $auth
     */
    public function __construct(AuthFactory $auth)
    {
        $this->guard = $auth->guard('backend');
    }

    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  \Closure $next
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($this->guard->guest()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response('Unauthorized.', 401);
            }

            return redirect()->guest(URL::route('backend.auth'));
        }

        $user = $this->guard->user();
        if (!($user instanceof HasAccessEntity) || count($user->getPermissions()) === 0) {
            throw new AccessDeniedHttpException();
        }
        $routeResolver = $request->getRouteResolver();
        /* @var Route $route */
        $route = $routeResolver();
        $action = $route->getAction();
        if (is_string($action['uses'])) {
            [$class] = $segments = explode('@', $action['uses']);
            $method = count($segments) === 2 ? $segments[1] : '__invoke';
            $reader = new AnnotationReader();
            $class = new ReflectionClass($class);
            $this->checkAnnotation(
                $request,
                $user,
                $reader->getClassAnnotation($class, PermissionAnnotation::class)
            );
            $this->checkAnnotation(
                $request,
                $user,
                $reader->getMethodAnnotation($class->getMethod($method), PermissionAnnotation::class)
            );
        }

        return $next($request);
    }

    /**
     * @param Request                   $request
     * @param HasAccessEntity           $user
     * @param PermissionAnnotation|null $annotation
     *
     * @return void
     * @throws HttpResponseException
     */
    protected function checkAnnotation(
        Request $request,
        HasAccessEntity $user,
        PermissionAnnotation $annotation = null
    ): void {
        if ($annotation !== null && !$user->hasAccess($annotation->permissions, $annotation->all)) {
            if ($request->ajax()) {
                throw new HttpResponseException(new JsonResponse([], Response::HTTP_FORBIDDEN));
            }
            throw new HttpResponseException(new Response(self::module()->view('deny'), Response::HTTP_FORBIDDEN));
        }
    }
}
