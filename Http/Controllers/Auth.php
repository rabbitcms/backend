<?php namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Auth\AuthManager;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use RabbitCMS\Backend\Support\Metronic;

class Auth extends Controller
{
    use ValidatesRequests;

    /**
     * @var \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
     */
    protected $guard;

    public function __construct(AuthManager $auth)
    {
        $this->guard = $auth->guard('backend');
        Metronic::module('login');
    }

    public function getLogin()
    {
        return \View::make('backend::auth.login');
    }

    public function postLogin(Request $request)
    {
        $this->validate(
            $request,
            [
                'email'    => 'required',
                'password' => 'required',
            ]
        );

        $credentials = $request->only('email', 'password');
        if ($this->guard->attempt($credentials, $request->has('remember'))) {
            return \Redirect::intended();
        }

        return redirect()->route('backend.auth')
            ->withInput($request->only('email'))
            ->withErrors(
                [
                    'email' => 'Введено невірний логін або пароль',
                ]
            );
    }

    public function getLogout()
    {
        $this->guard->logout();

        return redirect()->route('backend.index');
    }
}