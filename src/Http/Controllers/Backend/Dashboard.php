<?php
declare(strict_types = 1);
namespace RabbitCMS\Backend\Http\Controllers\Backend;

/**
 * Class Dashboard
 *
 * @package RabbitCMS\Backend\Http\Controllers\Backend
 */
class Dashboard extends Controller
{
    /**
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return $this->view('index');
    }
}
