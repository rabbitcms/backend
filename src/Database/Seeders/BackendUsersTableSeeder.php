<?php
declare(strict_types = 1);
namespace RabbitCMS\Backend\Database\Seeders;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use RabbitCMS\Backend\Entities\User;

/**
 * Class BackendUsersTableSeeder.
 *
 * @package RabbitCMS\Backend
 */
class BackendUsersTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        User::create([
            'email'    => 'admin@domain.com',
            'password' => 'admin',
            'active'   => 1,
        ]);
    }
}
