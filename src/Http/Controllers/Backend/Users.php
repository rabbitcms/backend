<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\View\View as ViewContract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
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
    protected function before(): void
    {
        View::composer(self::module()->viewName('users.form'), function (ViewContract $view) {
            $view->with('groups', GroupModel::query()->get());
        });
    }

    /**
     * @return ViewContract
     */
    public function getIndex(): ViewContract
    {
        return self::module()->view('users.index');
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function postIndex(Request $request): JsonResponse
    {
        return (new UsersDataProvider())->response($request);
    }

    /**
     * @return ViewContract
     * @Permissions("system.users.write")
     */
    public function getCreate(): ViewContract
    {
        $model = new UserModel();

        return self::module()->view('users.form', ['model' => $model]);
    }

    /**
     * @param UsersCreateRequest $request
     *
     * @return JsonResponse
     * @Permissions("system.users.write")
     * @throws \Exception|\Throwable
     */
    public function postCreate(UsersCreateRequest $request): JsonResponse
    {
        $model = new UserModel();

        return $this->save($model, $request);
    }

    /**
     * @param $id
     *
     * @return ViewContract
     * @Permissions("system.users.write")
     */
    public function getEdit($id): ViewContract
    {
        $model = UserModel::query()
            ->findOrFail($id);

        return self::module()->view('users.form', ['model' => $model]);
    }

    /**
     * @param                    $id
     * @param UsersUpdateRequest $request
     *
     * @return JsonResponse
     * @Permissions("system.users.write")
     * @throws \Exception|\Throwable
     */
    public function postEdit($id, UsersUpdateRequest $request): JsonResponse
    {
        /* @var UserModel $model */
        $model = UserModel::query()
            ->findOrFail($id);

        return $this->save($model, $request);
    }

    /**
     * @param $id
     * @Permissions("system.users.write")
     *
     * @throws \Exception
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
     * @param UserModel $model
     * @param Request   $request
     *
     * @return JsonResponse
     * @throws \Exception|\Throwable
     */
    protected function save(UserModel $model, Request $request): JsonResponse
    {
        return DB::transaction(function () use ($model, $request) {
            $data = $request->only('email', 'active', 'name');

            $model->fill($data);

            $password = $request->input('password');
            if ($password !== null && strlen($password = trim($password)) > 0) {
                $model->setPasswordAttribute($password);
            }

            $result = $model->save();
            $model->groups()
                ->sync($request->input('groups', []));

            return new JsonResponse(['result' => $result]);
        });
    }
}
