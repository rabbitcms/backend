<?php namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use RabbitCMS\Backend\Support\Metronic;

class Auth extends Controller
{
    use ValidatesRequests;
    public function __construct()
    {
        Metronic::module('login');
    }

    public function getLogin()
    {
        return \View::make('backend.auth.login');
    }

    public function postLogin(Request $request)
    {
        $this->validate(
            $request,
            [
                'email'    => 'required',
                'password' => 'required'
            ]
        );

        $credentials = $request->only('email', 'password');
        if (\Auth::attempt($credentials, $request->has('remember'))) {
            return \Redirect::intended();
        }

        return redirect('/auth/login')
            ->withInput($request->only('email'))
            ->withErrors(
                [
                    'email' => 'Введено невірний логін або пароль',
                ]
            );
    }

    public function getLogout()
    {
        \Auth::logout();

        return redirect('/');
    }
}