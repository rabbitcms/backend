<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Factory;

use Illuminate\Support\HtmlString;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Backend\Support\Action;
use RabbitCMS\Modules\Concerns\BelongsToModule;

/**
 * Class ActionsFactory
 * @package RabbitCMS\Backend\Factory
 */
class ActionsFactory
{
    use BelongsToModule;

    /**
     * @var Action[][]
     */
    private $actions = [];

    /**
     * @var User
     */
    private $user;

    public function __construct(User $user = null)
    {
        $this->user = $user;
    }

    /**
     * @param User $user
     *
     * @return ActionsFactory
     */
    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @param string   $model
     * @param Action[] ...$tabs
     *
     * @return ActionsFactory
     */
    public function extend(string $model, Action ...$tabs): self
    {
        if (!\array_key_exists($model, $this->actions)) {
            $this->actions[$model] = [];
        }

        foreach ($tabs as $tab) {
            $this->actions[$model][] = $tab;
        }
        return $this;
    }

    /**
     * @param object $object
     *
     * @return Action[]
     */
    public function resolve($object): array
    {
        $model = get_class($object);
        if (!\array_key_exists($model, $this->actions)) {
            return [];
        }

        $tabs = array_filter($this->actions[$model], function (Action $action) use ($object) {
            return $action->isEnabled($object) && $this->user instanceof User
                && $this->user->hasAccess($action->getPermissions(), $action->isPermissionsAll());
        });

        usort($tabs, function (Action $a, Action $b) {
            return $a->getPriority() <=> $b->getPriority();
        });

        return $tabs;
    }

    /**
     * @param object $object
     *
     * @return HtmlString
     */
    public function show($object): HtmlString
    {
        return new HtmlString(self::module()->view('layouts.actions', [
            '_actions' => $this->resolve($object),
            'object' => $object
        ])->render());
    }
}
