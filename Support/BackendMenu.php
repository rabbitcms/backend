<?php

namespace RabbitCMS\Backend\Support;

class BackendMenu
{
    protected $menu = [];

    public function addMenu($name, $label, $link = '', $icon = '', $permissions = [])
    {
        if (array_key_exists($name, $this->menu))
            return;

        $this->menu[$name] = [
            'label'       => $label,
            'link'        => $link,
            'icon'        => $icon,
            'permissions' => $permissions,
        ];
    }

    public function addItem($menu, $name, $label, $link = '', $icon = '', $permissions = [])
    {
        $this->menu[$menu]['items'][] = [
            'menu'        => $name,
            'label'       => $label,
            'link'        => $link,
            'icon'        => $icon,
            'permissions' => $permissions,
        ];
    }

    public function getMenu()
    {
        /* @var \RabbitCMS\Backend\Entities\User $user */
        $user = \Auth::guard('backend')->user();
        $menu = [];
        foreach ($this->menu as $name => $item) {
            if (empty($item['permissions']) || $user->hasAccess($item['permissions'], false)) {
                $menu[$name] = $item;
                if (!empty($item['items'])) {
                    $menu[$name]['items'] = [];
                    foreach ($item['items'] as $subItem) {
                        if (empty($subItem['permissions']) || $user->hasAccess($subItem['permissions'], false)) {
                            $menu[$name]['items'][] = $subItem;
                        }
                    }
                }
            }
        }

        return $menu;
    }
}