<?php

namespace RabbitCMS\Backend\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Bus\DispatchesJobs;
use RabbitCMS\Backend\Support\ConfigMaker;

class MakeConfigCommand extends Command
{
    use DispatchesJobs;
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
     * @return void
     */
    public function handle()
    {
        file_put_contents(public_path('backend/config.js'), $this->dispatchNow(new ConfigMaker()));
    }
}
