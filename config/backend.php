<?php
declare(strict_types = 1);

use RabbitCMS\Backend\Support\Backend;

return [
    'boot' => function (Backend $backend) {
        $backend->addAclGroup('system', trans('backend::acl.system.title'));
        $backend->addAclResolver(
            function (Backend $acl) {
                $acl->addAcl('system', 'users.read', trans('backend::acl.users.read'));
                $acl->addAcl('system', 'users.write', trans('backend::acl.users.write'));
                $acl->addAcl('system', 'groups.read', trans('backend::acl.groups.read'));
                $acl->addAcl('system', 'groups.write', trans('backend::acl.groups.write'));
            }
        );

        $backend->addMenuResolver(
            function (Backend $menu) {
                $menu->addMenu(
                    null,
                    'system',
                    trans('backend::menu.system'),
                    null,
                    'icon-settings',
                    null,
                    100000
                );

                $menu->addMenu(
                    'system',
                    'users',
                    trans('backend::menu.users'),
                    route('backend.backend.users'),
                    'fa-angle-double-right',
                    ['system.users.read'],
                    10
                );

                $menu->addMenu(
                    'system',
                    'groups',
                    trans('backend::menu.groups'),
                    route('backend.backend.groups'),
                    'fa-angle-double-right',
                    ['system.groups.read'],
                    20
                );
            },
            Backend::MENU_PRIORITY_MENU
        );
    },
    'requirejs' => [
        'packages' => [
            'rabbitcms' => 'js',
            'styles' => 'css',
            'jquery.validation' => [
                'location' => 'plugins/jquery-validation/js',
                'main' => 'jquery.validate.min'
            ],
            'select2' => [
                'location' => 'plugins/select2',
                'main' => 'js/select2.full.min'
            ],
            'icheck' => [
                'location' => 'plugins/icheck',
                'main' => 'icheck.min'
            ],
            'bootstrap-switch' => [
                'location' => 'plugins/bootstrap-switch',
                'main' => 'js/bootstrap-switch.min'
            ],
            'slimScroll' => [
                'location' => 'plugins/jquery-slimscroll',
                'main' => 'jquery.slimscroll.min'
            ],
            'jquery.fancybox' => [
                'location' => 'plugins/fancybox/source',
                'main' => 'jquery.fancybox.pack'
            ],
            'bootstrap-tabdrop' => [
                'location' => 'plugins/bootstrap-tabdrop',
                'main' => 'js/bootstrap-tabdrop'
            ],
            'bootstrap-confirmation' => [
                'location' => 'pugins/bootstrap-confirmation',
                'main' => 'bootstrap-confirmation.min'
            ],
            'jquery.counterup' => [
                'location' => 'plugins/counterup',
                'main' => 'jquery.counterup.min'
            ],
            'jszip' => [
                'location' => 'plugins/jszip',
                'main' => 'jszip.min'
            ],
            'pdfmake' => [
                'location' => 'plugins/pdfmake',
                'main' => 'pdfmake.min'
            ],
            'datatables.net-buttons' => [
                'location' => 'plugins/datatables/plugins/buttons',
                'main' => 'js/dataTables.buttons.min'
            ],
            'bootstrap-datepicker' => [
                'location' => 'plugins/bootstrap-datepicker',
                'main' => 'js/bootstrap-datepicker'
            ],
            'bootstrap-daterangepicker' => [
                'location' => 'plugins/bootstrap-daterangepicker',
                'main' => 'js/daterangepicker'
            ],
            'bootstrap-editable' => [
                'location' => 'plugins/bootstrap-editable',
                'main' => 'js/bootstrap-editable'
            ],
            'fuelux-spinner' => [
                'location' => 'plugins/fuelux-spinner',
                'main' => 'js/spinner'
            ],
            'jquery.colorbox' => [
                'location' => 'plugins/colorbox',
                'main' => 'jquery.colorbox'
            ],
            'tinymce' => [
                'location' => 'plugins/tinymce',
                'main' => 'jquery.tinymce.min'
            ],
            'jquery.inputmask' => [
                'location' => 'plugins/jquery-inputmask',
                'main' => 'inputmask'
            ],
            'bootstrap-touchspin' => [
                'location' => 'plugins/bootstrap-touchspin',
                'main' => 'bootstrap.touchspin'
            ],
            'moment' => [
                'location' => 'plugins/moment',
                'main' => 'moment'
            ],
            'ace' => [
                'location' => 'plugins/ace',
                'main' => 'ace'
            ],
            'intl-tel-input' => [
                'location' => 'plugins/intl-tel-input',
                'main' => 'intlTelInput'
            ]
        ],
        'modules'  => [
            'css' => 'plugins/require-css',
            'i18n' => 'plugins/i18n',
            'jquery' => 'plugins/jquery.min',
            'bootbox' => 'plugins/bootbox',
            'jquery.cookie' => 'plugins/jquery.cokie.min',
            'jquery.backstretch' => 'plugins/backstretch/jquery.backstretch.min',
            'jquery.blockui' => 'plugins/jquery.blockui.min',
            'jquery.maskMoney' => 'plugins/jquery.maskMoney.min',
            'datatables.net' => [
                'path' => 'plugins/datatables/jquery.dataTables.min',
                'css' => 'plugins/datatables/css/jquery.dataTables.min.css'
            ],
            'datatables.net-bs' => [
                'path' => 'plugins/datatables/plugins/bootstrap/datatables.bootstrap',
                'css' => [
                    'plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                    'css/plugins/datatable.css'
                ]
            ],
            'datatables.net-colReorder' => 'plugins/datatables/plugins/colReorder/dataTables.colReorder.min'
        ]
    ],
    'handlers'  => [
        '' => 'rabbitcms/dashboard:init',
        'groups' => [
            'module' => 'rabbitcms/groups',
            'exec' => 'table',
            'permanent' => true,
            'menuPath' => 'system.groups'
        ],
        'groups\/create' => [
            'module' => 'rabbitcms/groups',
            'exec' => 'form',
            'menuPath' => 'system.users'
        ],
        'groups\/edit\/(\d+)' => [
            'module' => 'rabbitcms/groups',
            'exec' => 'form',
            'menuPath' => 'system.users'
        ],
        'users' => [
            'module' => 'rabbitcms/users',
            'exec' => 'table',
            'permanent' => true,
            'menuPath' => 'system.users'
        ],
        'users\/create' => [
            'module' => 'rabbitcms/users',
            'exec' => 'form',
            'menuPath' => 'system.users'
        ],
        'users\/edit\/(\d+)' => [
            'module' => 'rabbitcms/users',
            'exec' => 'form',
            'menuPath' => 'system.users'
        ]
    ]
];
