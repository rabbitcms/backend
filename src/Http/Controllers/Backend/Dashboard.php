<?php
declare(strict_types = 1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Http\Response as IlluminateResponse;
use RabbitCMS\Backend\Facades\Backend;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class Dashboard
 *
 * @package RabbitCMS\Backend\Http\Controllers\Backend
 */
class Dashboard extends Controller
{
    /**
     * @return Response
     *
     * @throws \InvalidArgumentException
     */
    public function index(): Response
    {
        return Backend::getDashboardAction(function () {
            return new IlluminateResponse(self::module()->view('index'));
        });
    }
}
