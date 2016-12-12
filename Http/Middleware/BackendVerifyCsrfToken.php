<?php
declare(strict_types = 1);
namespace RabbitCMS\Backend\Http\Middleware;

use App\Http\Middleware\VerifyCsrfToken;
use Closure;
use Illuminate\Http\Response;
use Illuminate\Session\TokenMismatchException;

/**
 * Class BackendVerifyCsrfToken.
 */
class BackendVerifyCsrfToken extends VerifyCsrfToken
{
    /**
     * {@inheritdoc}
     */
    public function handle($request, Closure $next)
    {
        try {
            return parent::handle($request, $next);
        } catch (TokenMismatchException $e) {
            return new Response($e->getMessage(), Response::HTTP_FORBIDDEN);
        }
    }
}
