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
 */
final class TabsFactory
{
    use BelongsToModule;

    private $tabs = [];

    /**
     * @var User
     */
    private $user;

    public function __construct(User $user = null)
    {
        $this->user = $user;
    }

    /**
     * @param string $model
     * @param Tab[]  ...$tabs
     *
     * @return TabsFactory
     */
    public function extend(string $model, Tab ...$tabs): self
    {
        if (!\array_key_exists($model, $this->tabs)) {
            $this->tabs[$model] = [];
        }

        foreach ($tabs as $tab) {
            $this->tabs[$model][] = $tab;
        }
        return $this;
    }

    /**
     * @param object $object
     *
     * @return array
     */
    public function resolve($object): array
    {
        $model = get_class($object);
        if (!\array_key_exists($model, $this->tabs)) {
            return [];
        }

        $tabs = array_filter($this->tabs[$model], function (Tab $tab) use ($object) {
            return $tab->isEnabled($object) && $this->user->hasAccess($tab->getPermissions(), $tab->isPermissionsAll());
        });

        usort($tabs, function (Tab $a, Tab $b) {
            return $a->getPriority() <=> $b->getPriority();
        });

        return $tabs;
    }

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
            ] + $data)->render());
    }

    /**
     * @param User $user
     *
     * @return TabsFactory
     */
    public function setUser(User $user): TabsFactory
    {
        $this->user = $user;

        return $this;
    }
}
