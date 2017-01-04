<?php namespace RabbitCMS\Backend\Http\Middleware;

use Closure;
use Doctrine\Common\Annotations\AnnotationReader;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Routing\Route;
use RabbitCMS\Backend\Annotation\Permissions as PermissionAnnotation;
use RabbitCMS\Backend\Contracts\HasAccessEntity;
use ReflectionClass;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use URL;

class Authenticate
{
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
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($this->guard->guest()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response('Unauthorized.', 401);
            } else {
                return redirect()->guest(URL::route('backend.auth'));
            }
        }
        $user = $this->guard->user();
        if (!($user instanceof HasAccessEntity) || count($user->getPermissions()) === 0) {
            throw new AccessDeniedHttpException;
        } else {
            $routeResolver = $request->getRouteResolver();
            /* @var Route $route */
            $route = $routeResolver();
            $action = $route->getAction();
            if (is_string($action['uses'])) {
                list($class, $method) = explode('@', $action['uses']);
                $reader = new AnnotationReader();
                $class = new ReflectionClass($class);
                $annotation = $reader->getClassAnnotation($class, PermissionAnnotation::class);
                if ($annotation instanceof PermissionAnnotation && !$user->hasAccess($annotation->permissions,
                        $annotation->all)
                ) {
                    if ($request->ajax()) {
                        return new JsonResponse([], Response::HTTP_FORBIDDEN);
                    } else {
                        return $this->forbiddenRequest();
                    }
                }

                if ($method = $class->getMethod($method)) {
                    $annotation = $reader->getMethodAnnotation($method, PermissionAnnotation::class);
                    if ($annotation instanceof PermissionAnnotation && !$user->hasAccess($annotation->permissions,
                            $annotation->all)
                    ) {
                        if ($request->ajax()) {
                            return new JsonResponse([], Response::HTTP_FORBIDDEN);
                        } else {
                            return $this->forbiddenRequest();
                        }
                    }
                }
            }
        }
        return $next($request);
    }

    /**
     * @return Response
     */
    protected function forbiddenRequest()
    {
        return \Response::view('backend::deny', [], Response::HTTP_FORBIDDEN);
    }
}
