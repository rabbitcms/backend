<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Requests;

use Illuminate\Routing\Route;
use RabbitCMS\Carrot\Http\Request;

/**
 * Class UsersUpdateRequest
 *
 * @package RabbitCMS\Backend\Http\Requests
 */
class UsersUpdateRequest extends Request
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
     * @param Route $route
     *
     * @return array
     */
    public function rules(Route $route): array
    {
        $rules = [
            'email'  => 'required|unique:backend_users,email,' . $route->parameter('id'),
            'active' => 'required',
            'groups' => 'required',
        ];

        return $rules;
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'email'  => trans('backend::users.email'),
            'active' => trans('backend::users.status'),
            'groups' => trans('backend::users.groups'),
        ];
    }
}
