<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Requests;

use RabbitCMS\Carrot\Http\Request;

/**
 * Class UsersCreateRequest
 *
 * @package RabbitCMS\Backend\Http\Requests
 */
class UsersCreateRequest extends Request
{
    protected $errorBag = 'users';

    /**
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        $rules = [
            'email'    => 'required|unique:backend_users,email',
            'active'   => 'required',
            'groups'   => 'required',
            'password' => 'required',
        ];

        return $rules;
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'email'    => trans('backend::users.email'),
            'active'   => trans('backend::users.status'),
            'groups'   => trans('backend::users.groups'),
            'password' => trans('backend::users.password'),
        ];
    }
}
