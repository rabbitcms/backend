<?php

namespace RabbitCMS\Backend\Http\Controllers\Backend;


use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\Factory as ViewFactory;
use Illuminate\View\View;
use RabbitCMS\Backend\Annotation\Permissions;
use RabbitCMS\Backend\DataProviders\UsersDataProvider;
use RabbitCMS\Backend\Entities\Group as GroupModel;
use RabbitCMS\Backend\Entities\User as UserModel;
use RabbitCMS\Backend\Http\Requests\UsersCreateRequest;
use RabbitCMS\Backend\Http\Requests\UsersUpdateRequest;

/**
 * Class Users.
 * @Permissions("system.users.read")
 */
class Users extends Controller
{
    /**
     * @param ViewFactory $factory
     */
    public function init(ViewFactory $factory)
    {
        $factory->composer(
            $this->viewName('users.form'),
            function (View $view) {
                $view->with('groups', GroupModel::query()->get());
            }
        );
    }

    /**
     * @return View
     */
    public function getIndex()
    {
        return $this->view('users.index');
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function postIndex(Request $request)
    {
        return (new UsersDataProvider)->response($request);
    }

    /**
     * @return View
     * @Permissions("system.users.write")
     */
    public function getCreate()
    {
        $model = new UserModel;

        return $this->view('users.form', ['model' => $model]);
    }

    /**
     * @param UsersCreateRequest $request
     *
     * @return JsonResponse
     * @Permissions("system.users.write")
     */
    public function postCreate(UsersCreateRequest $request)
    {
        $model = new UserModel;

        return $this->save($model, $request);
    }

    /**
     * @param $id
     *
     * @return View
     * @Permissions("system.users.write")
     */
    public function getEdit($id)
    {
        $model = UserModel::query()
            ->findOrFail($id);

        return $this->view('users.form', ['model' => $model]);
    }

    /**
     * @param              $id
     * @param UsersUpdateRequest $request
     *
     * @return JsonResponse
     * @Permissions("system.users.write")
     */
    public function postEdit($id, UsersUpdateRequest $request)
    {
        /* @var UserModel $model */
        $model = UserModel::query()
            ->findOrFail($id);

        return $this->save($model, $request);
    }

    /**
     * @param $id
     * @Permissions("system.users.write")
     */
    public function postDelete($id)
    {
        $result = UserModel::query()
            ->findOrFail($id)
            ->delete();

        if ($result) {
            $this->success(trans('backend::common.deleting_ok'));
        }

        $this->error(trans('backend::common.deleting_error'));
    }

    /**
     * @param UserModel    $model
     * @param Request $request
     *
     * @return JsonResponse
     */
    protected function save(UserModel $model, Request $request)
    {
        return \DB::transaction(
            function () use ($model, $request) {
                $data = $request->only('email', 'active', 'name');

                $model->fill($data);

                $password = $request->input('password');
                if ($password !== null && strlen($password = trim($password)) > 0) {
                    $model->setPasswordAttribute($password);
                }

                $result = $model->save();
                $model->groups()
                    ->sync($request->input('groups', []));

                return \Response::json(['result' => $result]);
            }
        );
    }
}
