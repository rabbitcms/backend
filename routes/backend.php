<?php

declare(strict_types=1);

use Illuminate\Routing\Router;

/* @var Router $router */
$router->group(['prefix' => 'users', 'as' => 'users.'], function (Router $router) {
    $router->get('', 'Users@getIndex')->name('index');
    $router->post('', 'Users@postIndex')->name('list');

    $router->get('create', 'Users@getCreate')->name('create');
    $router->post('create', 'Users@postCreate')->name('store');

    $router->get('edit/{id}', 'Users@getEdit')->name('edit');
    $router->post('edit/{id}', 'Users@postEdit')->name('update');

    $router->any('delete/{id}', 'Users@anyDelete')->name('destroy');
});

$router->group(['prefix' => 'groups', 'as' => 'groups.'], function (Router $router) {
    $router->get('', 'Groups@getIndex')->name('index');
    $router->post('', 'Groups@postIndex')->name('list');

    $router->get('create', 'Groups@getCreate')->name('create');
    $router->post('create', 'Groups@postCreate')->name('store');

    $router->get('edit/{id}', 'Groups@getEdit')->name('edit');
    $router->post('edit/{id}', 'Groups@postEdit')->name('update');

    $router->any('delete/{id}', 'Groups@anyDelete')->name('destroy');

    $router->post('users/{group_id}/destroy/{user_id}', 'Groups@destroyUser')->name('dissociate');
    $router->post('users/{id}', 'Groups@getUsers')->name('users');
});
