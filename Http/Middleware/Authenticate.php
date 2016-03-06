<?php namespace RabbitCMS\Backend\Http\Middleware;

use Illuminate\Auth\AuthManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use URL;
use Closure;
use ReflectionClass;
use Doctrine\Common\Annotations\AnnotationReader;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Routing\Route;
use RabbitCMS\Carrot\Annotation\Permissions as PermissionAnnotation;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

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
     * @param  AuthManager $auth
     */
    public function __construct(AuthManager $auth)
    {
        $this->guard = $auth->guard('backend');
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     *
     * @throws \InvalidArgumentException
     * 
     * @return mixed
     * @todo Forbidden response template
     */
    public function handle($request, Closure $next)
    {
        /**
         * @var \RabbitCMS\Backend\Entities\User $user
         * @var Route $route
         */
        if ($this->guard->guest()) {
            if ($request->ajax()) {
                return response('Unauthorized.', 401);
            } else {
                return redirect()->guest(URL::route('backend.auth'));
            }
        } else {
            $user = $this->guard->user();
            if (count($user->getPermissions()) === 0) {
                throw new AccessDeniedHttpException;
            } else {
                $routeResolver = $request->getRouteResolver();
                $route = $routeResolver();
                $action = $route->getAction();
                if (is_string($action['uses'])) {
                    list($class, $method) = explode('@', $action['uses']);
                    $reader = new AnnotationReader();
                    $class = new ReflectionClass($class);
                    $annotation = $reader->getClassAnnotation($class, PermissionAnnotation::class);
                    if ($annotation !== null && !$user->hasAccess($annotation->permissions, $annotation->all)) {
                        if ($request->ajax()) {
                            return new JsonResponse([], Response::HTTP_FORBIDDEN);
                        } else {
                            return new Response('', Response::HTTP_FORBIDDEN);
                        }
                    }

                    if ($method = $class->getMethod($method)) {
                        $annotation = $reader->getMethodAnnotation($method, PermissionAnnotation::class);
                        if ($annotation !== null && !$user->hasAccess($annotation->permissions, $annotation->all)) {
                            if ($request->ajax()) {
                                return new JsonResponse([], Response::HTTP_FORBIDDEN);
                            } else {
                                return new Response('', Response::HTTP_FORBIDDEN);
                            }
                        }
                    }
                }
            }
        }

        return $next($request);
    }

    protected function check($user, PermissionAnnotation $annotation = null)
    {

    }
}
