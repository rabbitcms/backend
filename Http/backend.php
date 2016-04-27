<?php

Route::group(['namespace' => '\\RabbitCMS\\Backend\\Http\\Controllers'], function (\Illuminate\Routing\Router $router) {

    $router->group(['prefix' => 'users'], function (\Illuminate\Routing\Router $router) {
        $router->get('', ['as' => 'users', 'uses' => 'Users@getIndex']);
        $router->post('', ['as' => 'users.list', 'uses' => 'Users@postIndex']);

        $router->get('create', ['as' => 'users.create', 'uses' => 'Users@getCreate']);
        $router->post('create', ['as' => 'users.store', 'uses' => 'Users@postCreate']);

        $router->get('edit/{id}', ['as' => 'users.edit', 'uses' => 'Users@getEdit']);
        $router->post('edit/{id}', ['as' => 'users.update', 'uses' => 'Users@postEdit']);

        $router->any('delete/{id}', ['as' => 'users.destroy', 'uses' => 'Users@anyDelete']);
    });

    $router->group(['prefix' => 'groups'], function (\Illuminate\Routing\Router $router) {
        $router->get('', ['as' => 'groups', 'uses' => 'Groups@getIndex']);
        $router->post('', ['as' => 'groups.list', 'uses' => 'Groups@postIndex']);

        $router->get('create', ['as' => 'groups.create', 'uses' => 'Groups@getCreate']);
        $router->post('create', ['as' => 'groups.store', 'uses' => 'Groups@postCreate']);

        $router->get('edit/{id}', ['as' => 'groups.edit', 'uses' => 'Groups@getEdit']);
        $router->post('edit/{id}', ['as' => 'groups.update', 'uses' => 'Groups@postEdit']);

        $router->any('delete/{id}', ['as' => 'groups.destroy', 'uses' => 'Groups@anyDelete']);
    });

});