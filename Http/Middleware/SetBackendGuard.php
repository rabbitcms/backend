<?php

namespace RabbitCMS\Backend\Http\Middleware;

use Illuminate\Config\Repository;
use Illuminate\Http\Request;
use Closure;

class SetBackendGuard
{
    /**
     * The Guard implementation.
     *
     * @var Repository
     */
    protected $config;

    /**
     * Create a new filter instance.
     *
     * @param  Repository $config
     */
    public function __construct(Repository $config)
    {
        $this->config = $config;
    }

    /**
     * Handle an incoming request.
     *
     * @param  Request $request
     * @param  Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next) {
        $this->config->set('auth.defaults.guard','backend');
        return $next($request);
    }
}