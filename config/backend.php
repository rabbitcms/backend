<?php
declare(strict_types=1);

use RabbitCMS\Backend\Support\Backend;

return [
    'boot' => function (Backend $backend) {
        $backend->addAclResolver(
            function (Backend $acl) {
                $acl->addAclGroup('system', trans('backend::acl.system.title'));
                $acl->addAcl('system', 'users.read', trans('backend::acl.users.read'));
                $acl->addAcl('system', 'users.write', trans('backend::acl.users.write'));
                $acl->addAcl('system', 'groups.read', trans('backend::acl.groups.read'));
                $acl->addAcl('system', 'groups.write', trans('backend::acl.groups.write'));
            }
        );

        $backend->addMenuResolver(function (Backend $menu) {
            $menu->addMenu(null, 'system', trans('backend::menu.system'), null, 'icon-settings', null, 100000);
            $menu->addMenu(
                'system',
                'users',
                trans('backend::menu.users'),
                relative_route('backend.backend.users.'),
                'fa-angle-double-right',
                ['system.users.read'],
                10
            );
            $menu->addMenu(
                'system',
                'groups',
                trans('backend::menu.groups'),
                relative_route('backend.backend.groups.'),
                'fa-angle-double-right',
                ['system.groups.read'],
                20
            );
        }, Backend::MENU_PRIORITY_MENU);
    },
    'requirejs' => [
        'rabbitcms' => 'js',
        'rabbitcms.backend' => 'js/rabbitcms.backend',
        'rabbitcms.backend.login' => [
            'path' => 'js/rabbitcms.backend.login',
            'deps' => 'rabbitcms.backend'
        ],
        'rabbitcms.backend.users' => 'js/rabbitcms.backend.users',
        'rabbitcms.backend.users.groups' => 'js/rabbitcms.backend.users.groups',
        'jquery.mask' => 'https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.11/jquery.mask.min',
        'jquery.cookie' => 'https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie',
        'tslib'=>'https://cdnjs.cloudflare.com/ajax/libs/tslib/1.9.3/tslib.min'
    ],
    'handlers' => [
        '.*' => true
    ]
];
