<?php

namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Contracts\Container\Container;
use RabbitCMS\Carrot\Http\ModuleController;

class BackendController extends ModuleController
{
    public function __construct(Container $app)
    {
        parent::__construct($app);
    }
}