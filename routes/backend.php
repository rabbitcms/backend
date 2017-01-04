<?php
declare(strict_types=1);
use Illuminate\Routing\Router;

/* @var Router $router */

$router->group(['prefix' => 'users'], function (Router $router) {
    $router->get('', ['as' => 'users', 'uses' => 'Users@getIndex']);
    $router->post('', ['as' => 'users.list', 'uses' => 'Users@postIndex']);

    $router->get('create', ['as' => 'users.create', 'uses' => 'Users@getCreate']);
    $router->post('create', ['as' => 'users.store', 'uses' => 'Users@postCreate']);

    $router->get('edit/{id}', ['as' => 'users.edit', 'uses' => 'Users@getEdit']);
    $router->post('edit/{id}', ['as' => 'users.update', 'uses' => 'Users@postEdit']);

    $router->post('delete/{id}', ['as' => 'users.delete', 'uses' => 'Users@postDelete']);
});

$router->group(['prefix' => 'groups'], function (Router $router) {
    $router->get('', ['as' => 'groups', 'uses' => 'Groups@getIndex']);
    $router->post('', ['as' => 'groups.list', 'uses' => 'Groups@postIndex']);

    $router->get('create', ['as' => 'groups.create', 'uses' => 'Groups@getCreate']);
    $router->post('create', ['as' => 'groups.store', 'uses' => 'Groups@postCreate']);

    $router->get('edit/{id}', ['as' => 'groups.edit', 'uses' => 'Groups@getEdit']);
    $router->post('edit/{id}', ['as' => 'groups.update', 'uses' => 'Groups@postEdit']);

    $router->post('delete/{id}', ['as' => 'groups.delete', 'uses' => 'Groups@postDelete']);

    $router->post('users/{group_id}/delete/{user_id}', ['as' => 'groups.users.delete', 'uses' => 'Groups@postDeleteUser']);
    $router->post('users/{id}', ['as' => 'groups.users', 'uses' => 'Groups@getUsers']);
});
