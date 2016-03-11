<?php

namespace RabbitCMS\Backend\Http\Controllers;


use Illuminate\Contracts\Container\Container;
use RabbitCMS\Backend\Support\Metronic;
use RabbitCMS\Carrot\Http\ModuleController;


class Users extends ModuleController
{
    protected $module = 'backend';
    
    public function __construct(Container $container)
    {
        parent::__construct($container);
        Metronic::module(['datatable', 'validate', 'spinner']);

        Metronic::addPath(trans('Home'), '/');
        Metronic::addPath(trans('System'), null);
    }

    public function getIndex(){
        Metronic::menu('system', 'users');
        return $this->view('users/index');
    }
}