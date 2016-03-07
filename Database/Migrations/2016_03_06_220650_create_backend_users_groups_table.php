<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBackendUsersGroupsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('backend_users_groups', function(Blueprint $table)
        {
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('group_id');
            
            $table->primary(['user_id','group_id']);

            $table->foreign('user_id')
                ->references('id')
                ->on('backend_users')
                ->onDelete('cascade');

            $table->foreign('group_id')
                ->references('id')
                ->on('backend_groups')
                ->onDelete('cascade');
        });
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
