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
use RabbitCMS\Backend\Facades\Backend;
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
        try {
            $routeResolver = $request->getRouteResolver();
            /* @var Route $route */
            $route = $routeResolver();
            $action = $route->getAction();
            if (is_string($action['uses'])) {
                [$class] = $segments = explode('@', $action['uses']);
                $method = count($segments) === 2 ? $segments[1] : '__invoke';
                $reader = new AnnotationReader();
                $class = new ReflectionClass($class);
                /** @var PermissionAnnotation $annotation */
                $annotation = $reader->getClassAnnotation($class, PermissionAnnotation::class);
                $this->checkAnnotation($user, $annotation);
                $annotation = $reader->getMethodAnnotation($class->getMethod($method), PermissionAnnotation::class);
                $this->checkAnnotation($user, $annotation);
            }

            Backend::getFacadeRoot();
            
            return $next($request);
        } catch (AccessDeniedHttpException $exception) {
            if ($request->ajax()) {
                throw new HttpResponseException(new JsonResponse([], Response::HTTP_FORBIDDEN));
            }
            throw new HttpResponseException(
                new Response(View::make(self::module()->viewName('deny'))->render(), Response::HTTP_FORBIDDEN)
            );
        }
    }

    /**
     * @param HasAccessEntity           $user
     * @param PermissionAnnotation|null $annotation
     *
     * @return void
     * @throws AccessDeniedHttpException
     */
    protected function checkAnnotation(
        HasAccessEntity $user,
        PermissionAnnotation $annotation = null
    ): void {
        if ($annotation !== null && !$user->hasAccess($annotation->permissions, $annotation->all)) {
            throw new AccessDeniedHttpException();
        }
    }
}
