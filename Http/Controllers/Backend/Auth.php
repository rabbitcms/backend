<?php namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use RabbitCMS\Backend\Support\Metronic;

class Auth extends Controller
{
    use ValidatesRequests;

    public function init()
    {
        Metronic::module('login');
    }

    public function getLogin()
    {
        return $this->view('auth.login');
    }

    public function postLogin(Request $request)
    {
        $this->validate(
            $request,
            [
                'email' => 'required|email',
                'password' => 'required',
            ]
        );

        $credentials = $request->only('email', 'password');
        $credentials['active'] = 1;
        if ($this->auth->attempt($credentials, $request->has('remember'))) {
            return \Redirect::intended();
        }

        return \Redirect::route('backend.auth')
            ->withInput($request->only('email'))
            ->withErrors(['email' => 'Введено невірний логін або пароль']);
    }

    public function getLogout()
    {
        $this->auth->logout();

        return redirect()->route('backend.index');
    }
}
