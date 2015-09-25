<?php
namespace RabbitCMS\Backend\Facades;

use Illuminate\Support\Facades\Facade;

class BackendAcl extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'backend.acl';
    }
}