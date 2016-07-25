<?php

use Illuminate\Routing\Router;
use RabbitCMS\Backend\Support\Backend;

return [
    'boot'      => function (Backend $backend) {
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
    'routes'    => function (Router $router) {
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
        'css'                            => 'plugins/require-css',
        'rabbitcms.backend'              => 'js/rabbitcms.backend',
        'rabbitcms.backend.login'        => [
            'path' => 'js/rabbitcms.backend.login',
            'deps' => 'rabbitcms.backend'
        ],
        'rabbitcms.backend.users'        => 'js/rabbitcms.backend.users',
        'rabbitcms.backend.users.groups' => 'js/rabbitcms.backend.users.groups',
        'jquery'                         => 'plugins/jquery.min.js',
        'bootbox'                        => 'plugins/bootbox.js',
        'jquery.cookie'                  => 'plugins/jquery.cokie.min.js'
    ],
    'handlers'  => [
        '.*' => true
    ]
];