<?php namespace RabbitCMS\Backend\Support;

class Metronic
{
    static $paths
        = [
            'awesome'                  => [[], ['global/plugins/font-awesome/css/font-awesome.min.css']],
            'components'               => [[], ['global/css/components.css']],
            'plugins'                  => [[], ['global/css/plugins.css']],
            'quick-sidebar'            => [['admin/layout/scripts/quick-sidebar.js'], [], 'QuickSidebar.init();'],
            'theme'                    => [
                ['admin/layout/scripts/layout.js'],
                [
                    'admin/layout/css/layout.css',
                    'admin/layout/css/themes/default.css',
                    'admin/layout/css/custom.css'
                ],
                'Layout.init();'
            ],
            'simple-line-icons'        => [[], ['global/plugins/simple-line-icons/simple-line-icons.min.css']],
            'jquery'                   => [['global/plugins/jquery-1.11.0.min.js'], []],
            'jquery-migrate'           => [['global/plugins/jquery-migrate-1.2.1.min.js'], []],
            'jquery-ui'                => [
                ['global/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js'],
                ['global/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.css']
            ],
            'bootstrap'                => [
                ['global/plugins/bootstrap/js/bootstrap.min.js'],
                ['global/plugins/bootstrap/css/bootstrap.min.css']
            ],
            'bootstrap-hover-dropdown' => [
                ['global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js'],
                []
            ],
            'jquery.slimscroll'        => [['global/plugins/jquery-slimscroll/jquery.slimscroll.min.js'], []],
            'jquery.blockui'           => [['global/plugins/jquery.blockui.min.js'], []],
            'jquery.cokie'             => [['global/plugins/jquery.cokie.min.js'], []],
            'jquery.uniform'           => [
                ['global/plugins/uniform/jquery.uniform.min.js'],
                ['global/plugins/uniform/css/uniform.default.css']
            ],
            'bootstrap-switch'         => [
                ['global/plugins/bootstrap-switch/js/bootstrap-switch.min.js'],
                ['global/plugins/bootstrap-switch/css/bootstrap-switch.min.css']
            ],
            'metronic'                 => [['global/scripts/metronic.js'], [], 'Metronic.init();'],
            'select2'                  => [
                ['global/plugins/select2/select2.min.js'],
                ['global/plugins/select2/select2.css']
            ],
            'dataTables.bootstrap'     => [
                ['global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js'],
                ['global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css']
            ],
            'dataTables.scroller'      => [
                ['global/plugins/datatables/extensions/Scroller/js/dataTables.scroller.min.js'],
                ['global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css']
            ],
            'dataTables.colReorder'    => [
                ['global/plugins/datatables/extensions/ColReorder/js/dataTables.colReorder.min.js'],
                ['global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css']
            ],
            'dataTables.tableTools'    => [
                ['global/plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js'],
                []
            ],
            'jquery.dataTables'        => [['global/plugins/datatables/media/js/jquery.dataTables.min.js'], []],
            'jquery.validate'          => [['global/plugins/jquery-validation/js/jquery.validate.min.js'], []],
            'jquery.backstretch'       => [
                ['global/plugins/backstretch/jquery.backstretch.min.js'],
                [],
                '$.backstretch(["/backend/assets/admin/pages/media/bg/1.jpg","/backend/assets/admin/pages/media/bg/2.jpg","/backend/assets/admin/pages/media/bg/3.jpg","/backend/assets/admin/pages/media/bg/4.jpg"], {fade: 1000,duration: 8000});'
            ],
            'login'                    => [
                ['admin/pages/scripts/login.js'],
                ['admin/pages/css/login.css'],
                'Login.init();'
            ],
            'lock'                     => [['admin/pages/scripts/lock.js'], ['admin/pages/css/lock.css']],
            'spinner'                  => [['global/plugins/fuelux/js/spinner.min.js'], []],
            'ion.rangeSlider'          => [
                ['global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js'],
                [
                    'global/plugins/ion.rangeslider/css/ion.rangeSlider.css',
                    'global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css'
                ]
            ],
            'bootstrap.touchspin'      => [['global/plugins/bootstrap-touchspin/bootstrap.touchspin.js'], []],
            'bootbox'                  => [['global/plugins/bootbox/bootbox.min.js'], []],
            'datatable'                => [['global/scripts/datatable.js'], []],
            'modal'                    => [
                [
                    'global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js',
                    'global/plugins/bootstrap-modal/js/bootstrap-modal.js'
                ],
                [
                    'global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css',
                    'global/plugins/bootstrap-modal/css/bootstrap-modal.css'
                ]
            ],
            'validate'                 => [
                [
                    'global/plugins/jquery-validation/js/jquery.validate.min.js',
                    'global/plugins/jquery-validation/js/additional-methods.min.js'
                ],
                []
            ],
            'datepicker'               => [
                ['global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js'],
                ['global/plugins/bootstrap-datepicker/css/datepicker3.css']
            ],
            'datetimepicker'           => [
                ['global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js'],
                ['global/plugins/bootstrap-datetimepicker/css/datetimepicker.css']
            ],
            'tinymce'                  => [
                [
                    'global/plugins/tinymce/tinymce.min.js',
                    'global/plugins/tinymce/jquery.tinymce.min.js'
                ],
                []
            ],
        ];
    static protected $base = '/backend/assets/';
    static protected $js = [];
    static protected $dr = [];
    static protected $css = [];
    static protected $req
        = [
            'login'                    => ['jquery.backstretch', 'jquery.validate'],
            'lock'                     => ['jquery.backstretch', 'jquery.validate'],
            'jquery.backstretch'       => ['jquery'],
            'jquery.validate'          => ['jquery'],
            'table'                    => [
                'dataTables.bootstrap',
                'dataTables.scroller',
                'dataTables.colReorder',
                'dataTables.tableTools',
                'select2'
            ],
            'datatable'                => ['table'],
            'dataTables.bootstrap'     => ['jquery.dataTables'],
            'dataTables.scroller'      => ['dataTables.bootstrap'],
            'dataTables.colReorder'    => ['dataTables.bootstrap'],
            'dataTables.tableTools'    => ['dataTables.bootstrap'],
            'metronic'                 => [
                'awesome',
                'jquery',
                'jquery-migrate',
                'jquery-ui',
                'simple-line-icons',
                'jquery.blockui',
                'bootstrap',
                'bootstrap-hover-dropdown',
                'bootstrap-switch',
                'jquery.slimscroll',
                'jquery.cokie',
                'jquery.uniform'
            ],
            'theme'                    => ['components', 'plugins', 'quick-sidebar', 'metronic'],
            'bootstrap-hover-dropdown' => ['bootstrap'],
            'bootstrap-switch'         => ['bootstrap'],
            'bootstrap'                => ['jquery'],
            'jquery-migrate'           => ['jquery'],
            'jquery-ui'                => ['jquery'],
            'jquery.slimscroll'        => ['jquery'],
            'jquery.blockui'           => ['jquery'],
            'jquery.cokie'             => ['jquery'],
            'jquery.uniform'           => ['jquery'],


        ];

    static protected $modules = [];

    static function module($module)
    {
        if (is_array($module)) {
            array_map([__CLASS__, __METHOD__], $module);
        } else {
            if (!isset(self::$modules[$module])) {
                self::$modules[$module] = $module;
                if (isset(self::$req[$module])) {
                    foreach (self::$req[$module] as $m) {
                        self::module($m);
                    }
                }

                if (isset(self::$paths[$module])) {
                    self::$js = array_merge(self::$js, self::$paths[$module][0]);
                    self::$css = array_merge(self::$css, self::$paths[$module][1]);
                    if (isset(self::$paths[$module][2])) {
                        self::$dr[] = self::$paths[$module][2];
                    }
                }
            }
        }
    }

    static function addDR($js)
    {
        self::$dr[] = $js;
    }

    static function base()
    {
        self::module('theme');

        return self::$base;
    }

    static function js()
    {
        self::module('theme');

        return self::$js;
    }

    static function css()
    {
        self::module('theme');

        return self::$css;
    }

    static function dr()
    {
        self::module('theme');

        return join(PHP_EOL, self::$dr);
    }

    static function init()
    {
        self::module('metronic');
    }

    /* ADMIN DASHBOARD MENU ITEM */
    static protected $menu = [null, null];

    static function menu($menu = null, $subItem = null)
    {
        self::$menu = [$menu, $subItem];
    }

    static function isMenu($menu, $subItem = null)
    {
        return self::$menu[0] == $menu && ($subItem === null || self::$menu[1] == $subItem);
    }

    /* ADMIN DASHBOARD BREADCRUMBS */
    static protected $breadcrumbs = [];

    static function addPath($title, $url = null, array $attributes = [])
    {
        self::$breadcrumbs[] = [$title, $url, $attributes];
    }

    static function breadcrumbs()
    {
        return self::$breadcrumbs;
    }
}

Metronic::init();