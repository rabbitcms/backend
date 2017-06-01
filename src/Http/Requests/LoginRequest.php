<?php
declare(strict_types = 1);

namespace RabbitCMS\Backend\Http\Requests;

use RabbitCMS\Carrot\Http\Request;

/**
 * Class LoginRequest
 *
 * @package RabbitCMS\Backend\Http\Requests
 */
class LoginRequest extends Request
{
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
        return [
            'email' => 'required|email',
            'password' => 'required'
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'email' => trans('backend::login.login'),
            'password' => trans('backend::login.password')
        ];
    }
}
