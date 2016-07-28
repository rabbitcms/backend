<?php

namespace RabbitCMS\Backend\Support;

use Illuminate\Contracts\Container\Container;
use RabbitCMS\Backend\Entities\User;

class Backend
{
    const MENU_PRIORITY_MENU = 0;
    const MENU_PRIORITY_ITEMS = 1;

    /**
     * @var Container
     */
    protected $container;

    /**
     * ACL resolvers.
     *
     * @var (string|callable)[]
     */
    protected $aclResolvers = [];

    /**
     * Group list.
     *
     * @var array
     */
    protected $aclGroups = [];

    /**
     * Acl list.
     *
     * @var array
     */
    protected $acl = null;

    /**
     * Menu resolvers.
     *
     * @var (string|callable)[]
     */
    protected $menuResolvers = [];

    /**
     * Menu definitions.
     *
     * @var array|null
     */
    protected $menu = null;

    /**
     * Active path.
     *
     * @var string
     */
    protected $activeMenu;

    /**
     * @var bool
     */
    protected $menuChanged = false;

    /**
     * BackendAcl constructor.
     *
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Add acl resolver.
     *
     * @param callable|string $callback
     */
    public function addAclResolver($callback)
    {
        $this->aclResolvers[] = $callback;
    }

    /**
     * Add new group to ACL.
     *
     * @param string $group
     * @param string $label
     */
    public function addAclGroup($group, $label)
    {
        if (array_key_exists($group, $this->aclGroups)) {
            throw  new \RuntimeException(sprintf('Acl group with name "%s" already exist.', $group));
        }
        $this->aclGroups[$group] = $label;
    }

    /**
     * Add new ACL item to group.
     *
     * @param string $group
     * @param string $name
     * @param string $label
     */
    public function addAcl($group, $name, $label)
    {
        if (!array_key_exists($group, $this->aclGroups)) {
            throw  new \RuntimeException(sprintf('Acl group with name "%s" not found.', $group));
        }
        $this->acl[$group . '.' . $name] = $label;
    }

    /**
     * Get acl groups.
     *
     * @return array
     */
    public function getAclGroups()
    {
        $this->getAllAcl();

        return $this->aclGroups;
    }

    /**
     * Get all acl lists.
     *
     * @return array
     */
    public function getAllAcl()
    {
        if ($this->acl === null) {
            $this->acl = [];
            $this->callAll($this->aclResolvers);
        }

        return $this->acl;
    }

    /**
     * Call all callbacks.
     * @param array $callbacks
     */
    protected function callAll(array $callbacks)
    {
        foreach ($callbacks as $callback) {
            $this->container->call($callback, [$this]);
        }
    }

    /**
     * Get ACL rules for module or its section.
     *
     * @param string $group
     * @param string $acl [optional]
     *
     * @return array
     */
    public function getGroupPermissions($group, $acl = null)
    {
        $rule = '/^' . preg_quote($group . '.' . ($acl ? $acl . '.' : '')) . '/';

        $result = [];

        foreach ($this->getAllAcl() as $key => $value) {
            if (preg_match($rule, $key)) {
                $result[$key] = $value;
            }
        }

        return $result;
    }

    /**
     * Add menu resolver.
     *
     * @param callable|string $callback
     * @param int $priority
     */
    public function addMenuResolver($callback, $priority = self::MENU_PRIORITY_ITEMS)
    {
        $priority = (int)$priority;
        if (!array_key_exists($priority, $this->menuResolvers)) {
            $this->menuResolvers[$priority] = [];
        }
        $this->menuResolvers[$priority][] = $callback;
    }

    /**
     * Define backend item.
     *
     * @param string|null $parent
     * @param string $name
     * @param string $caption
     * @param string $url
     * @param array|null $permissions
     * @param string|null $icon
     * @param int $position
     */
    public function addMenu($parent, $name, $caption, $url, $icon = null, array $permissions = null, $position = 0)
    {
        $this->menuChanged = true;
        $menu = ['items' => &$this->menu];
        if ($parent === null) {
            $path = $name;
        } else {
            $parents = explode('.', $parent);

            while (count($parents) > 0 && array_key_exists($parents[0], $menu['items'])) {
                $menu = &$menu['items'][$parents[0]];
                array_shift($parents);
            }
            if (count($parents) > 0) {
                throw new \RuntimeException(sprintf('Menu with name "%s" not found.', $parent));
            }
            $path = $menu['path'] . '.' . $name;
        }

        if (array_key_exists($name, $menu['items'])) {
            throw  new \RuntimeException(sprintf('Menu with name "%s" in menu "%s" already exist.', $name, $parent));
        }

        $items = [];

        $menu['items'][$name] = compact('caption', 'url', 'permissions', 'icon', 'name', 'position', 'path', 'items');
    }

    /**
     * Get allowed menu.
     *
     * @param string $guard [optional]
     *
     * @return array
     */
    public function getAccessMenu($guard = null)
    {
        $user = \Auth::guard($guard)->user();
        if (!($user instanceof User)) {
            return [];
        }

        return $this->accessFilter($user, $this->getMenu());
    }

    /**
     * Check items permissions.
     *
     * @param User $user
     * @param array $items
     *
     * @return array
     */
    protected function accessFilter(User $user, array $items)
    {
        $filteredItems = array_filter(
            $items,
            function ($item) use ($user) {
                return $item['permissions'] === null || $user->hasAccess($item['permissions'], false);
            }
        );

        array_walk(
            $filteredItems,
            function (&$item) use ($user) {
                if (count($item['items']) > 0) {
                    $item['items'] = $this->accessFilter($user, $item['items']);
                }
            }
        );

        //cleanup empty menus
        return array_filter(
            $filteredItems,
            function ($item) use ($user) {
                return $item['url'] !== null || count($item['items']) > 0;
            }
        );
    }

    /**
     * Get menu definitions.
     *
     * @return array
     */
    public function getMenu()
    {
        if ($this->menu === null) {
            $this->menu = [];
            ksort($this->menuResolvers, SORT_NUMERIC);
            array_walk($this->menuResolvers,
                function ($callbacks) {
                    $this->callAll($callbacks);
                }
            );
        }

        if ($this->menuChanged) {
            $this->sortMenu($this->menu);
            $this->menuChanged = false;
        }

        return $this->menu;
    }

    /**
     * Sort menu items.
     *
     * @param array $items
     *
     * @return void
     */
    protected function sortMenu(array &$items)
    {
        uasort(
            $items,
            function (array $a, array $b) {
                return $a['position'] > $b['position'];
            }
        );

        array_walk(
            $items,
            function (&$item) {
                $this->sortMenu($item['items']);
            }
        );
    }

    /**
     * Set active path.
     * @param string[] ...$path
     */
    public function setActiveMenu(...$path)
    {
        $this->activeMenu = implode('.', $path);
    }

    /**
     * Get active path.
     * @return string
     */
    public function getActiveMenu()
    {
        return $this->activeMenu;
    }

    /**
     * Check active item.
     *
     * @param array $item
     *
     * @return bool
     */
    public function isActiveMenu(array $item)
    {
        return preg_match('/^' . preg_quote($item['path']) . '/', $this->activeMenu) != 0;
    }

    /**
     * Get active items.
     * @param array $prepend
     * @return array
     */
    public function getActiveMenuItems(array $prepend = [])
    {
        $path = explode('.', $this->activeMenu);
        $items = $this->getMenu();
        $result = $prepend;
        while (count($path) > 0 && array_key_exists($path[0], $items)) {
            $item = $result[] = $items[array_shift($path)];
            $items = $item['items'];
        }

        return $result;
    }
}
