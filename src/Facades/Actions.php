<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Facades;

use Illuminate\Support\Facades\Facade;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Backend\Factory\TabsFactory;
use RabbitCMS\Backend\Support\Tab;

/**
 * Class Actions
 * @package RabbitCMS\Backend\Facades
 * @method static TabsFactory extend(string $model, Actions ...$tabs)
 * @method static Actions[] resolve(string $model, $object = null)
 * @method static HtmlString show(string $model, $object = null)
 * @method static TabsFactory setUser(User $user)
 */
class Actions extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor(): string
    {
        return 'backend.actions';
    }
}
