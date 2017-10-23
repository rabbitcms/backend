<?php
declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use RabbitCMS\Backend\Entities\Group;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Backend\Facades\Backend;

/**
 * Class CreateBackendUsersGroupsTable
 */
class CreateBackendUsersGroupsTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('backend_users_groups', function (Blueprint $table) {
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('group_id');

            $table->primary(['user_id', 'group_id']);

            $table->foreign('user_id')
                ->references('id')
                ->on('backend_users')
                ->onDelete('cascade');

            $table->foreign('group_id')
                ->references('id')
                ->on('backend_groups')
                ->onDelete('cascade');
        });

        //Add initial user.
        $group = Group::create([
            'caption'     => 'Administrators',
            'permissions' => Backend::getAllAcl(),
        ]);
        $user = User::create([
            'email'    => 'admin@domain.com',
            'password' => 'admin',
            'active'   => 1,
        ]);
        $user->groups()->attach($group);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('backend_users_groups');
    }
}
