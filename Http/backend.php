<?php
Route::controller('users',\RabbitCMS\Backend\Http\Controllers\Users::class, [
    'getIndex'=>'users'
]);
//Route::group(['prefix' => 'users','as'=>'users'], function (\Illuminate\Routing\Router $router) {
//    $router->controller('', \RabbitCMS\Backend\Http\Controllers\Users::class, [
//        //'postUsers'=>''
//    ]);
//});
