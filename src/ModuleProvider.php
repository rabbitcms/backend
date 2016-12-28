<?php
declare(strict_types = 1);
namespace RabbitCMS\Backend;

/**
 * Class ModuleProvider.
 * @package RabbitCMS\Backend
 */
class ModuleProvider extends \RabbitCMS\Modules\ModuleProvider
{
    /**
     * @return string
     */
    public function name(): string
    {
        return 'backend';
    }
}
