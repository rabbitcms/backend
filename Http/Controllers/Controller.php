<?php

namespace RabbitCMS\Backend\Http\Controllers;

use RabbitCMS\Carrot\Http\ModuleController;

abstract class Controller extends ModuleController
{
    protected $module = 'backend';
}