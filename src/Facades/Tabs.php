<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Facades;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\HtmlString;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Backend\Factory\TabsFactory;
use RabbitCMS\Backend\Support\Tab;

/**
 * Class Tabs
 * @package RabbitCMS\Backend\Facades
 * @method static TabsFactory extend(string $model, Tab ...$tabs)
 * @method static Tab[] resolve(string $model, $object = null)
 * @method static HtmlString show(string $model, $object = null, array $data = [])
 * @method static TabsFactory setUser(User $user)
 */
class Tabs extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor(): string
    {
        return 'backend.tabs';
    }
}
