<?php

namespace RabbitCMS\Backend\Http\Requests;

use Illuminate\Routing\Route;
use RabbitCMS\Carrot\Http\Request;

class UsersRequest extends Request
{
    protected $errorBag = 'users';

    public function authorize()
    {
        return true;
    }

    public function rules(Route $route)
    {
        if ($route->getName() == 'backend.backend.users.update') {
            $rules = [
                'user.email'  => 'required|unique:backend_users,email,' . $route->parameter('id'),
                'user.active' => 'required',
                'groups'      => 'required',
            ];
        } else {
            $rules = [
                'user.email'  => 'required|unique:backend_users,email',
                'user.active' => 'required',
                'groups'      => 'required',
                'password'    => 'required',
            ];
        }

        return $rules;
    }

    public function attributes()
    {
        return [
            'user.email'  => 'E-mail',
            'user.active' => 'Статус',
            'groups'      => 'Групи',
            'password'    => 'Пароль',
        ];
    }
}
