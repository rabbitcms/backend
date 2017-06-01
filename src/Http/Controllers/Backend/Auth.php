<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use RabbitCMS\Backend\Http\Requests\LoginRequest;

/**
 * Class Auth
 *
 * @package RabbitCMS\Backend\Http\Controllers\Backend
 */
class Auth extends Controller
{
    /**
     * @return View
     */
    public function getLogin(): View
    {
        return $this->view('auth.login');
    }

    /**
     * @param LoginRequest $request
     *
     * @return RedirectResponse
     */
    public function postLogin(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        $credentials['active'] = 1;
        if ($this->guard()->attempt($credentials, $request->has('remember'))) {
            return \Redirect::intended();
        }

        return \Redirect::route('backend.auth')
            ->withInput($request->only('email'))
            ->withErrors(['credentials' => trans('backend::login.wrong credentials')]);
    }

    /**
     * @return RedirectResponse
     */
    public function getLogout(): RedirectResponse
    {
        $this->guard()->logout();

        return redirect()->route('backend.index');
    }
}
