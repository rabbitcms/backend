<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers;

/**
 * Class Main
 *
 * @package RabbitCMS\Backend\Http\Controllers
 */
class Main
{
    /**
     * @return string
     */
    public function getIndex(): string
    {
        return "Main Page";
    }
}

