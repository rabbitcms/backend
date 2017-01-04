<?php

namespace RabbitCMS\Backend\Http\Middleware;

use Closure;
use Illuminate\Auth\SessionGuard;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Auth\Guard;

class AuthenticateWithBasicAuth
{
    /**
     * The Guard implementation.
     *
     * @var SessionGuard
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
     * @param  \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $this->guard->basic() ?: $next($request);
    }
}