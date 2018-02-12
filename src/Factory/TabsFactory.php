<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Factory;

use Illuminate\Contracts\View\View;
use Illuminate\Support\HtmlString;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Backend\Support\Tab;
use RabbitCMS\Modules\Concerns\BelongsToModule;

/**
 * Class TabsFactory
 * @package RabbitCMS\Backend\Factory
 * @method self extend(string $name, Tab ...$tabs)
 * @method Tab[] resolve(object $object)
 */
final class TabsFactory extends ActionsFactory
{
    use BelongsToModule;

    /**
     * @param object $object
     * @param array  $data
     *
     * @return HtmlString
     */
    public function show($object, array $data = []): HtmlString
    {
        return new HtmlString(self::module()->view('layouts.tabs', [
            '_tabs' => $this->resolve($object),
            'object' => $object,
            'data' => $data
        ])->render());
    }
}
