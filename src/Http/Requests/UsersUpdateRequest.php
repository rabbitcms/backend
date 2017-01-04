<?php

namespace RabbitCMS\Backend\Http\Requests;

use Illuminate\Routing\Route;
use RabbitCMS\Carrot\Http\Request;

class UsersUpdateRequest extends Request
{
    protected $errorBag = 'users';

    public function authorize()
    {
        return true;
    }

    public function rules(Route $route)
    {
        $rules = [
            'email'  => 'required|unique:backend_users,email,' . $route->parameter('id'),
            'active' => 'required',
            'groups' => 'required',
        ];

        return $rules;
    }

    public function attributes()
    {
        return [
            'email'  => trans('backend::users.email'),
            'active' => trans('backend::users.status'),
            'groups' => trans('backend::users.groups'),
        ];
    }
}
