<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Facades;

use Illuminate\Support\Facades\Facade;
use RabbitCMS\Backend\Support\Backend as SBackend;

/**
 * Class Backend
 *
 * @package RabbitCMS\Backend\Facades
 */
class Backend extends Facade
{
    /**
     * @inheritdoc
     */
    protected static function getFacadeAccessor()
    {
        return SBackend::class;
    }
}
