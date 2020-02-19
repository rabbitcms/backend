<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Middleware;

use Closure;
use Illuminate\Config\Repository;
use Illuminate\Http\Request;
use RabbitCMS\Modules\Concerns\BelongsToModule;

/**
 * Class SetBackendGuard
 *
 * @package RabbitCMS\Backend\Http\Middleware
 */
class SetBackendGuard
{
    use BelongsToModule;

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

        $this->config->set('auth.defaults.guard', 'backend');
        $this->config->set('session.cookie', 'rbc_backend');
        $this->config->set('session.path', '/' . ltrim(self::module()->config('path'), '/'));
        $this->config->set('session.domain', self::module()->config('domain'));
    }

    /**
     * Handle an incoming request.
     *
     * @param  Request $request
     * @param  Closure $next
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        return $next($request);
    }
}
