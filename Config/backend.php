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
                $menu->addMenu('system', 'users', trans('backend::menu.users'), relative_route('backend.backend.users'), 'fa-angle-double-right', ['system.users.read'], 10);
                $menu->addMenu('system', 'groups', trans('backend::menu.groups'), relative_route('backend.backend.groups'), 'fa-angle-double-right', ['system.groups.read'], 20);
            },
            Backend::MENU_PRIORITY_MENU
        );
    },
    'routes'    => function (Router $router) {
        $router->group(
            ['prefix' => 'users'],
            function (\Illuminate\Routing\Router $router) {
                $router->get('', ['as' => 'users', 'uses' => 'Users@getIndex']);
                $router->post('', ['as' => 'users.list', 'uses' => 'Users@postIndex']);

                $router->get('create', ['as' => 'users.create', 'uses' => 'Users@getCreate']);
                $router->post('create', ['as' => 'users.store', 'uses' => 'Users@postCreate']);

                $router->get('edit/{id}', ['as' => 'users.edit', 'uses' => 'Users@getEdit']);
                $router->post('edit/{id}', ['as' => 'users.update', 'uses' => 'Users@postEdit']);

                $router->any('delete/{id}', ['as' => 'users.destroy', 'uses' => 'Users@anyDelete']);
            }
        );

        $router->group(
            ['prefix' => 'groups'],
            function (\Illuminate\Routing\Router $router) {
                $router->get('', ['as' => 'groups', 'uses' => 'Groups@getIndex']);
                $router->post('', ['as' => 'groups.list', 'uses' => 'Groups@postIndex']);

                $router->get('create', ['as' => 'groups.create', 'uses' => 'Groups@getCreate']);
                $router->post('create', ['as' => 'groups.store', 'uses' => 'Groups@postCreate']);

                $router->get('edit/{id}', ['as' => 'groups.edit', 'uses' => 'Groups@getEdit']);
                $router->post('edit/{id}', ['as' => 'groups.update', 'uses' => 'Groups@postEdit']);

                $router->any('delete/{id}', ['as' => 'groups.destroy', 'uses' => 'Groups@anyDelete']);

                $router->post(
                    'users/{group_id}/destroy/{user_id}',
                    ['as' => 'groups.users.destroy', 'uses' => 'Groups@destroyUser']
                );
                $router->post('users/{id}', ['as' => 'groups.users', 'uses' => 'Groups@getUsers']);
            }
        );
    },
    'requirejs' => [
        'packages' => [
            'rabbitcms'              => 'js',
            'styles'                 => 'css',
            'jquery.validation'      => [
                'location' => 'plugins/jquery-validation/js',
                'main'     => 'jquery.validate.min',
            ],
            'select2'                => [
                'location' => 'plugins/select2',
                'main'     => 'js/select2.min',
            ],
            'icheck'                 => [
                'location' => 'plugins/icheck',
                'main'     => 'icheck.min',
            ],
            'bootstrap-switch'       => [
                'location' => 'plugins/bootstrap-switch',
                'main'     => 'js/bootstrap-switch.min',
            ],
            'slimScroll'             => [
                'location' => 'plugins/jquery-slimscroll',
                'main'     => 'jquery.slimscroll.min',
            ],
            'jquery.fancybox'        => [
                'location' => 'plugins/fancybox/source',
                'main'     => 'jquery.fancybox.pack',
            ],
            'bootstrap-tabdrop'      => [
                'location' => 'plugins/bootstrap-tabdrop',
                'main'     => 'js/bootstrap-tabdrop',
            ],
            'bootstrap-confirmation' => [
                'location' => 'pugins/bootstrap-confirmation',
                'main'     => 'bootstrap-confirmation.min',
            ],
            'jquery.counterup'       => [
                'location' => 'plugins/counterup',
                'main'     => 'jquery.counterup.min',
            ],
            'jszip'                  => [
                'location' => 'plugins/jszip',
                'main'     => 'jszip.min',
            ],
            'pdfmake'                => [
                'location' => 'plugins/pdfmake',
                'main'     => 'pdfmake.min',
            ],
            'datatables.net-buttons' => [
                'location' => 'plugins/datatables/plugins/buttons',
                'main'     => 'js/dataTables.buttons.min',
            ],
            'bootstrap-datepicker' => [
                'location' => 'plugins/bootstrap-datepicker',
                'main'     => 'js/bootstrap-datepicker',
            ],
            'bootstrap-daterangepicker' => [
                'location' => 'plugins/bootstrap-daterangepicker',
                'main'     => 'js/daterangepicker',
            ],
            'bootstrap-editable' => [
                'location' => 'plugins/bootstrap-editable',
                'main'     => 'js/bootstrap-editable',
            ],
        ],
        'modules'  => [
            'css'                => 'plugins/require-css',
            'i18n'               => 'plugins/i18n',
            'jquery'             => 'plugins/jquery.min',
            'bootbox'            => 'plugins/bootbox',
            'jquery.cookie'      => 'plugins/jquery.cokie.min',
            'jquery.backstretch' => 'plugins/backstretch/jquery.backstretch.min',
            'jquery.blockui'     => 'plugins/jquery.blockui.min',

            'datatables.net'            => [
                'path' => 'plugins/datatables/jquery.dataTables.min',
                'css'  => 'plugins/datatables/css/jquery.dataTables.min.css',
            ],
            'datatables.net-bs'         => [
                'path' => 'plugins/datatables/plugins/bootstrap/datatables.bootstrap',
                'css'  => [
                    'plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                    'css/plugins/datatable.css',
                ],
            ],
            'datatables.net-colReorder' => 'plugins/datatables/plugins/colReorder/dataTables.colReorder.min',

            'jquery.colorbox' => [
                'path' => 'plugins/colorbox/jquery.colorbox',
                'css'  => 'plugins/colorbox/colorbox.css',
            ],
        ],
    ],
    'handlers'  => [
        ''                    => 'rabbitcms/dashboard:init',
        'groups'              => [
            'module'    => 'rabbitcms/groups',
            'exec'      => 'table',
            'permanent' => true,
            'menuPath'  => 'system.groups',
        ],
        'groups\/create'      => [
            'module'   => 'rabbitcms/groups',
            'exec'     => 'form',
            'menuPath' => 'system.users',
        ],
        'groups\/edit\/(\d+)' => [
            'module'   => 'rabbitcms/groups',
            'exec'     => 'form',
            'menuPath' => 'system.users',
        ],
        'users'               => [
            'module'    => 'rabbitcms/users',
            'exec'      => 'table',
            'permanent' => true,
            'menuPath'  => 'system.users',
        ],
        'users\/create'       => [
            'module'   => 'rabbitcms/users',
            'exec'     => 'form',
            'menuPath' => 'system.users',
        ],
        'users\/edit\/(\d+)'  => [
            'module'   => 'rabbitcms/users',
            'exec'     => 'form',
            'menuPath' => 'system.users',
        ],
    ],
];
