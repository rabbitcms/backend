<?php
namespace RabbitCMS\Backend\Support;

use Illuminate\Config\Repository as ConfigRepository;
use Pingpong\Modules\Module;
use Pingpong\Modules\Repository as ModulesRepository;

/**
 * Class ConfigMaker.
 */
class ConfigMaker
{
    /**
     * @param ModulesRepository $modules
     * @param ConfigRepository $cfg
     * @return string
     */
    public function handle(ModulesRepository $modules, ConfigRepository $cfg): string
    {
        $baseUrl = str_replace(public_path(), '', $modules->getAssetsPath());
        $config = [
            'baseUrl' => rtrim($baseUrl, '/') . '/',
            'shim' => [],
            'bundles' => [],
            'paths' => []
        ];
        $opts = [
            'path'=>asset_module("backend","backend"),
            'handlers'=> []
        ];
        $prefix = $cfg->get('module.backend.path');
        $dir = public_path('backend');
        if (!is_dir($dir)) {
            mkdir($dir);
        }

        /* @var Module $module */
        foreach ($modules->enabled() as $module) {
            $path = $module->getExtraPath('Config/backend.php');
            if (file_exists($path)) {
                $value = require($path);
                if (is_array($value)) {
                    if (array_key_exists('handlers', $value)) {
                        foreach ($value['handlers'] as $handler => $options) {
                            $path = '/' . ltrim($prefix . '/' . $module->getLowerName() . ($handler ? '/' : ''), '/');
                            $handler = preg_quote($path, '/.') . $handler;
                            if (!is_array($options)) {
                                if (is_bool($options)) {
                                    $options = [

                                    ];
                                } else {
                                    $mod = explode(':', $options);
                                    $options = [
                                        'module' => $mod[0],
                                    ];
                                    if (!empty($mod[1])) {
                                        $options['exec'] = $mod[1];
                                    }
                                }
                            }
                            $options['handler'] = $handler;
                            $opts['handlers'][] = $options;
                        }
                    }
                    if (array_key_exists('requirejs', $value) && is_array($value['requirejs'])) {
                        foreach ($value['requirejs'] as $m => $c) {
                            if (is_string($c)) {
                                $config['paths'][$m] = $module->getLowerName() . '/backend/' . ltrim($c, '/');
                            } elseif (is_array($c)) {
                                if (array_key_exists('path', $c)) {
                                    $config['paths'][$m] = $module->getLowerName() . '/backend/' . ltrim($c['path'],
                                            '/');
                                }
                                if (array_key_exists('deps', $c)) {
                                    $config['shim'][$m] = ['deps' => (array)$c['deps']];
                                }
                                if (array_key_exists('bundles', $c)) {
                                    $config['bundles'][$m] = (array)$c['bundles'];
                                }
                                if (array_key_exists('css', $c)) {
                                    $config['shim'][$m]['deps'] = $config['shim'][$m]['deps'] ?? [];
                                    foreach ((array)$c['css'] as $css) {
                                        $config['shim'][$m]['deps'][] =
                                            'css!' . $module->getLowerName() . '/backend/' . ltrim($css, '/');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        ksort($config['paths']);
        $time = time();
        $config = json_encode($config, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        $opts = json_encode($opts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        $out =
            /* @lang JavaScript */
            <<<JS
(function() {
    var config = ${config};
    config.urlArgs = function(id, url) {
        return (url.indexOf('?') === -1 ? '?' : '&') + ${time};
    };
    require.config(config);
    //detect jquery
    if (window.jQuery !== void 0) {
        define('jquery', [], function() { return jQuery; });
    }
    require(['rabbitcms.backend'], function(rbc) {
        rbc.RabbitCMS.init(${opts});
    });
})();

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
JS;
        return $out;
    }
}