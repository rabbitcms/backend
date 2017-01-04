<?php namespace RabbitCMS\Backend\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use RabbitCMS\Backend\Entities\User;

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