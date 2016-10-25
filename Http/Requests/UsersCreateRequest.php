<?php

namespace RabbitCMS\Backend\Http\Requests;


use RabbitCMS\Carrot\Http\Request;

class UsersCreateRequest extends Request
{
    protected $errorBag = 'users';

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'email'    => 'required|unique:backend_users,email',
            'active'   => 'required',
            'groups'   => 'required',
            'password' => 'required',
        ];

        return $rules;
    }

    public function attributes()
    {
        return [
            'email'    => trans('backend::users.email'),
            'active'   => trans('backend::users.status'),
            'groups'   => trans('backend::users.groups'),
            'password' => trans('backend::users.password'),
        ];
    }
}
