<?php
declare(strict_types=1);
use Illuminate\Routing\Router;

/* @var Router $router */
$router->group(['prefix' => 'users', 'as' => 'users.'], function (Router $router) {
    $router->get('', ['uses' => 'Users@getIndex']);
    $router->post('', ['as' => 'list', 'uses' => 'Users@postIndex']);

    $router->get('create', ['as' => 'create', 'uses' => 'Users@getCreate']);
    $router->post('create', ['as' => 'store', 'uses' => 'Users@postCreate']);

    $router->get('edit/{id}', ['as' => 'edit', 'uses' => 'Users@getEdit']);
    $router->post('edit/{id}', ['as' => 'update', 'uses' => 'Users@postEdit']);

    $router->any('delete/{id}', ['as' => 'destroy', 'uses' => 'Users@anyDelete']);
});

$router->group(['prefix' => 'groups', 'as' => 'groups.'], function (Router $router) {
    $router->get('', ['uses' => 'Groups@getIndex']);
    $router->post('', ['as' => 'list', 'uses' => 'Groups@postIndex']);

    $router->get('create', ['as' => 'create', 'uses' => 'Groups@getCreate']);
    $router->post('create', ['as' => 'store', 'uses' => 'Groups@postCreate']);

    $router->get('edit/{id}', ['as' => 'edit', 'uses' => 'Groups@getEdit']);
    $router->post('edit/{id}', ['as' => 'update', 'uses' => 'Groups@postEdit']);

    $router->any('delete/{id}', ['as' => 'destroy', 'uses' => 'Groups@anyDelete']);

    $router->post('users/{group_id}/destroy/{user_id}', ['as' => 'dissociate', 'uses' => 'Groups@destroyUser']);
    $router->post('users/{id}', ['as' => 'users', 'uses' => 'Groups@getUsers']);
});
