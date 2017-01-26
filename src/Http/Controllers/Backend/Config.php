<?php
declare(strict_types = 1);
namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Http\Response;
use RabbitCMS\Backend\Support\ConfigMaker;

/**
 * Class Config
 *
 * @package RabbitCMS\Backend\Http\Controllers\Backend
 */
class Config extends Controller
{
    use DispatchesJobs;

    /**
     * @return Response
     */
    public function make()
    {
        $response = new Response($this->dispatchNow(new ConfigMaker()), 200, [
            'Content-Type' => 'application/javascript',
        ]);
        $response->headers->addCacheControlDirective('public');
        $response->headers->addCacheControlDirective('max-age', 60 * 60);

        return $response;
    }
}
