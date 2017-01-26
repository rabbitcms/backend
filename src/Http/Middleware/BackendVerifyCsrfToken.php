<?php
declare(strict_types = 1);
namespace RabbitCMS\Backend\Http\Middleware;

use Closure;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
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
        } catch (TokenMismatchException $exception) {
            return new Response($exception->getMessage(), Response::HTTP_UNAUTHORIZED);
        }
    }
}
