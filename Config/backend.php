<?php

use Illuminate\Routing\Router;
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

        $backend->addMenuResolver(
            function (Backend $menu) {
                $menu->addMenu(null, 'system', trans('backend::menu.system'), null, 'icon-settings', null, 100000);
                $menu->addMenu('system', 'users', trans('backend::menu.users'), relative_route('backend.backend.users'),
                    'fa-angle-double-right', ['system.users.read'], 10);
                $menu->addMenu('system', 'groups', trans('backend::menu.groups'),
                    relative_route('backend.backend.groups'), 'fa-angle-double-right', ['system.groups.read'], 20);
            }, Backend::MENU_PRIORITY_MENU
        );
    },
    'routes' => function (Router $router) {
        $router->group(['prefix' => 'users'], function (\Illuminate\Routing\Router $router) {
            $router->get('', ['as' => 'users', 'uses' => 'Users@getIndex']);
            $router->post('', ['as' => 'users.list', 'uses' => 'Users@postIndex']);

            $router->get('create', ['as' => 'users.create', 'uses' => 'Users@getCreate']);
            $router->post('create', ['as' => 'users.store', 'uses' => 'Users@postCreate']);

            $router->get('edit/{id}', ['as' => 'users.edit', 'uses' => 'Users@getEdit']);
            $router->post('edit/{id}', ['as' => 'users.update', 'uses' => 'Users@postEdit']);

            $router->any('delete/{id}', ['as' => 'users.destroy', 'uses' => 'Users@anyDelete']);
        });

        $router->group(['prefix' => 'groups'], function (\Illuminate\Routing\Router $router) {
            $router->get('', ['as' => 'groups', 'uses' => 'Groups@getIndex']);
            $router->post('', ['as' => 'groups.list', 'uses' => 'Groups@postIndex']);

            $router->get('create', ['as' => 'groups.create', 'uses' => 'Groups@getCreate']);
            $router->post('create', ['as' => 'groups.store', 'uses' => 'Groups@postCreate']);

            $router->get('edit/{id}', ['as' => 'groups.edit', 'uses' => 'Groups@getEdit']);
            $router->post('edit/{id}', ['as' => 'groups.update', 'uses' => 'Groups@postEdit']);

            $router->any('delete/{id}', ['as' => 'groups.destroy', 'uses' => 'Groups@anyDelete']);

            $router->post('users/{group_id}/destroy/{user_id}',
                ['as' => 'groups.users.destroy', 'uses' => 'Groups@destroyUser']);
            $router->post('users/{id}', ['as' => 'groups.users', 'uses' => 'Groups@getUsers']);
        });
    },
    'requirejs' => [
        "css" => "plugins/require-css",
        "i18n" => "plugins/i18n",
        "rabbitcms.backend" => "js/rabbitcms.backend",
        "rabbitcms.backend.login" => "js/rabbitcms.backend.login",
        "rabbitcms.datatable" => "js/rabbitcms.datatable",
        "rabbitcms.users" => "js/rabbitcms.users",
        "rabbitcms.groups" => "js/rabbitcms.groups",

        "rabbitcms/nls/datatable" => "js/nls/datatable",
        "rabbitcms/nls/backend" => "js/nls/backend",
        "rabbitcms/nls/ru/datatable" => "js/nls/ru/datatable",
        "rabbitcms/nls/uk/datatable" => "js/nls/uk/datatable",
        "jquery" => "plugins/jquery.min",
        "bootbox" => "plugins/bootbox",
        'jquery.cookie' => 'plugins/jquery.cokie.min',
        "jquery.backstretch" => 'plugins/backstretch/jquery.backstretch.min',
        "jquery.validation.additional" => "plugins/jquery-validation/additional-methods.min",
        "jquery.validation" => "plugins/jquery-validation/jquery.validate.min",
        "jquery.uniform" => [
            "path" => "plugins/uniform/jquery.uniform.min",
            "css" => "plugins/uniform/css/uniform.default.css"
        ],
        "jquery.blockui" => "plugins/jquery.blockui.min",
        "datatables.net" => [
            "path" => "plugins/datatables/jquery.dataTables.min",
            "css" => "plugins/datatables/css/jquery.dataTables.min.css",
        ],
        "datatables.net-bt" => [
            "path" => "plugins/datatables/plugins/bootstrap/datatables.bootstrap",
            "css" => [
                "plugins/datatables/plugins/bootstrap/datatables.bootstrap.css",
                "css/plugins/datatable.css"
            ],
        ],
        "select2" => [
            "path" => "plugins/select2/js/select2.min",
            "css" => [
                "plugins/select2/css/select2.min.css",
                "plugins/select2/css/select2-bootstrap.min.css",
                "css/plugins/select2.css"
            ]
        ],
        "jquery.colorbox" => [
            "path" => "plugins/colorbox/jquery.colorbox",
            "css" => "plugins/colorbox/colorbox.css"
        ]
    ],
    'handlers' => [
        '' => 'rabbitcms.backend.dashboard:init',
        'groups' => [
            'module' => 'rabbitcms.groups',
            'exec' => 'table',
            'permanent' => true
        ],
        'groups\/create' => 'rabbitcms.groups:form',
        'groups\/edit\/(\d+)' => 'rabbitcms.groups:form',
        'users' => [
            'module' => 'rabbitcms.users',
            'exec' => 'table',
            'permanent' => true
        ],
        'users\/create' => 'rabbitcms.users:form',
        'users\/edit\/(\d+)' => 'rabbitcms.users:form',
    ]
];
