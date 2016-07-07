<?php

namespace RabbitCMS\Backend\Facades;

use Illuminate\Support\Facades\Facade;
use RabbitCMS\Backend\Support\Backend as SBackend;

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