<?php
declare(strict_types = 1);
namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\View\View;

/**
 * Class Main
 * @package RabbitCMS\Backend\Http\Controllers\Backend
 */
class Main extends Controller
{
    /**
     * @return View
     */
    public function index():View
    {
        return $this->view('index');
    }
}