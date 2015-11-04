<?php namespace RabbitCMS\Backend\Support;

use Illuminate\Support\Facades\Auth;

class BackendMenu
{
    protected $menu;

    public function addMenu($name, $label, $link = '', $icon = '', $permissions = [])
    {
        $this->menu[$name] = [
            'label'       => $label,
            'link'        => $link,
            'icon'        => $icon,
            'permissions' => $permissions
        ];
    }

    public function addItem($menu, $name, $label, $link = '', $icon = '', $permissions = [])
    {
        $this->menu[$menu]['items'][] = [
            'menu'        => $name,
            'label'       => $label,
            'link'        => $link,
            'icon'        => $icon,
            'permissions' => $permissions
        ];
    }

    public function getMenu()
    {
        $user = Auth::user();
        $menu = [];
        foreach ($this->menu as $name => $item) {
            if (empty($item['permissions']) || $user->hasAccess($item['permissions'])) {
                $menu[$name] = $item;
                if (!empty($item['items'])) {
                    $menu[$name]['items'] = [];
                    foreach($item['items'] as $subItem) {
                        if (empty($subItem['permissions']) || $user->hasAccess($subItem['permissions'])) {
                            $menu[$name]['items'][] = $subItem;
                        }
                    }
                }
            }
        }
        return $menu;
    }
}