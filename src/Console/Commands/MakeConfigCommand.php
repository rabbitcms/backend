<?php
declare(strict_types=1);
namespace RabbitCMS\Backend\Console\Commands;

use Illuminate\Console\Command;
use RabbitCMS\Modules\Facades\Modules;
use RabbitCMS\Modules\Module;

/**
 * Class MakeConfigCommand.
 *
 * @package RabbitCMS\Backend
 */
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
    public function handle()
    {
        $baseUrl = str_replace(public_path(), '/', Modules::getModulesAssetsRoot());
        $config = [
            'baseUrl' => '/'.rtrim($baseUrl, '/') . '/',
            'shim' => [],
            'paths' => [],
            'urlArgs' => (string) time()
        ];
        $dir = public_path('backend');
        if (!is_dir($dir)) {
            mkdir($dir);
        }
        $bootstraps = [[],[]];

        /* @var Module $module */
        foreach (Modules::enabled() as $module) {
            $path = $module->getPath('config/backend.php');
            if (file_exists($path)) {
                $value = require($path);
                if (is_array($value) && array_key_exists('bootstrap', $value) && is_array($value['bootstrap'])) {
                    $bootstraps[] = (array)$value['bootstrap'];
                }
                if (is_array($value) && array_key_exists('requirejs', $value) && is_array($value['requirejs'])) {
                    foreach ($value['requirejs'] as $m => $c) {
                        if (is_string($c)) {
                            $c = ['path' => $c];
                        }
                        if (is_array($c)) {
                            if (array_key_exists('path', $c)) {
                                $config['paths'][$m] = filter_var($c['path'], FILTER_VALIDATE_URL)
                                    ?: $module->getName() . '/backend/' . ltrim($c['path'], '/');
                            }
                            if (array_key_exists('deps', $c)) {
                                $config['shim'][$m] = ['deps'=>(array)$c['deps']];
                            }
                        }
                    }
                }
            }
        }

        $bootstraps = json_encode(array_merge(...$bootstraps));

        $config = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        file_put_contents(
            public_path('backend/config.js'),
            /* @lang JavaScript */
            "require.config(${config});\nrequire({$bootstraps}, function () {});"
        );
    }
}