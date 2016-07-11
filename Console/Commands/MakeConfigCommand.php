<?php

namespace RabbitCMS\Backend\Console\Commands;

use Illuminate\Console\Command;
use Pingpong\Modules\Module;

class MakeConfigCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:make-config';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Make RabbitCMS Backend config.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(\Pingpong\Modules\Repository $modules)
    {
        $baseUrl = str_replace(public_path(), '', $modules->getAssetsPath());
        $config = [
            'baseUrl' => rtrim($baseUrl, '/') . '/',
            'shim' => [],
            'paths' => [],
            'urlArgs' => time()
        ];
        $dir = public_path('backend');
        if (!is_dir($dir)) {
            mkdir($dir);
        }

        /* @var Module $module */
        foreach ($modules->enabled() as $module) {
            $path = $module->getExtraPath('Config/backend.php');
            if (file_exists($path)) {
                $value = require($path);
                if (is_array($value) && array_key_exists('requirejs', $value) && is_array($value['requirejs'])) {
                    foreach ($value['requirejs'] as $m => $c) {
                        if (is_string($c)) {
                            $config['paths'][$m] = $module->getLowerName() . '/' . ltrim($c, '/');
                        } elseif (is_array($c)) {
                            if (array_key_exists('path', $c)) {
                                $config['paths'][$m] = $module->getLowerName() . '/' . ltrim($c['path'], '/');
                            }
                            if (array_key_exists('deps', $c)) {
                                $config['shim'][$m] = ['deps'=>(array)$c['deps']];
                            }
                        }
                    }
                }
            }
        }


        $config = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        file_put_contents(
            public_path('backend/config.js'),
            /* @lang JavaScript */
            "require.config(${config});"
        );

    }
}