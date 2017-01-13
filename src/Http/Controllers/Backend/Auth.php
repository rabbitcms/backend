<?php
declare(strict_types = 1);
namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use RabbitCMS\Backend\Support\Metronic;

/**
 * Class Auth.
 * @package RabbitCMS\Backend
 */
class Auth extends Controller
{
    use ValidatesRequests;

    /**
     * @return View
     */
    public function getLogin():View
    {
        Metronic::module('login');
        return $this->view('auth.login');
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function postLogin(Request $request):RedirectResponse
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');
        $credentials['active'] = 1;
        if ($this->guard()->attempt($credentials, $request->has('remember'))) {
            return \Redirect::intended();
        }

        return \Redirect::route('backend.auth')
            ->withInput($request->only('email'))
            ->withErrors(['email' => 'Введено невірний логін або пароль']);
    }

    /**
     * @return RedirectResponse
     */
    public function getLogout():RedirectResponse
    {
        $this->guard()->logout();

        return redirect()->route('backend.index');
    }
}
