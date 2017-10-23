<?php
declare(strict_types = 1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\View\View;

/**
 * Class Dashboard
 *
 * @package RabbitCMS\Backend\Http\Controllers\Backend
 */
class Dashboard extends Controller
{
    /**
     * @return View
     */
    public function index():View
    {
        return self::module()->view('index');
    }
}
