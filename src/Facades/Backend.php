<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Facades;

use Illuminate\Support\Facades\Facade;
use RabbitCMS\Backend\Support\Backend as SBackend;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class Backend
 *
 * @method static Response getDashboardAction(\Closure $closure)
 */
class Backend extends Facade
{
    /**
     * @inheritdoc
     */
    protected static function getFacadeAccessor(): string
    {
        return SBackend::class;
    }
}
