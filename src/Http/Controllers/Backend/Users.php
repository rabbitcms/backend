<?php

declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\Factory as ViewFactory;
use RabbitCMS\Backend\Annotation\Permissions;
use RabbitCMS\Backend\Entities\Group as GroupModel;
use RabbitCMS\Backend\Entities\User as UserModel;
use RabbitCMS\Backend\Http\Requests\UsersRequest;
use RabbitCMS\Backend\Support\Backend;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class Users.
 * @Permissions("system.users.read")
 */
class Users extends Controller
{
    /**
     * Controller init.
     *
     * @param  Backend  $backend
     * @param  ViewFactory  $view
     */
    public function init(Backend $backend, ViewFactory $view)
    {
        $backend->setActiveMenu('system.users');

        $view->composer($this->viewName('users.form'), function (View $view) {
            $view->with('groups', GroupModel::query()->get());
        });
    }

    /**
     * @return View
     */
    public function getIndex(): View
    {
        return $this->view('users.index');
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function postIndex(Request $request): JsonResponse
    {
        $status = [0 => trans('backend::common.non_active'), 1 => trans('backend::common.active')];

        $query = UserModel::query();
        $recordsTotal = $query->count();

        $filters = $request->input('filter', []);
        if (! empty($filters['id'])) {
            $query->where('id', '=', $filters['id']);
        }
        if (array_key_exists('active', $filters) && $filters['active'] !== '') {
            $query->where('active', '=', $filters['active']);
        }
        if (! empty($filters['email'])) {
            (strpos($filters['email'], '%') !== false)
                ? $query->where('email', 'like', $filters['email'])
                : $query->where('email', '=', strtolower($filters['email']));
        }
        $recordsFiltered = $query->count();

        $query->limit($request->input('length', 25))
            ->offset($request->input('start', 0));

        $query->orderBy('id', 'desc');

        $collection = $query->get();

        $result = [];
        foreach ($collection as $item) {
            $edit_link = route('backend.backend.users.edit', ['id' => $item->id], false);
            $edit_link_html = html_link($edit_link, '<i class="fa fa-pencil"></i>', [
                'rel' => 'ajax-portlet',
                'class' => 'btn btn-sm green',
                'title' => trans('backend::common.buttons.edit'),
            ]);

            $destroy_link = html_link(
                route('backend.backend.users.destroy', ['id' => $item->id], false),
                '<i class="fa fa-trash-o"></i>',
                ['rel' => 'destroy', 'class' => 'btn btn-sm red', 'title' => trans('backend::common.buttons.destroy')]
            );

            $result[] = [
                $item->id,
                $item->name,
                $item->email,
                array_key_exists($item->active, $status) ? $status[$item->active] : $item->active,
                $edit_link_html.$destroy_link,
            ];
        }

        $data = [
            'data' => $result,
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'draw' => $request->input('draw'),
        ];

        return new JsonResponse($data, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return View
     * @Permissions("system.users.write")
     */
    public function getCreate(): View
    {
        return $this->view('users.form', [
            'model' => new UserModel,
        ]);
    }

    /**
     * @param  UsersRequest  $request
     *
     * @return Response
     * @Permissions("system.users.write")
     * @throws \Exception|\Throwable
     */
    public function postCreate(UsersRequest $request): Response
    {
        $model = new UserModel;

        return $this->save($model, $request);
    }

    /**
     * @param  UserModel  $model
     * @param  UsersRequest  $request
     *
     * @return Response
     * @throws \Exception|\Throwable
     */
    private function save(UserModel $model, UsersRequest $request): Response
    {
        return DB::transaction(function () use ($model, $request) {
            $data = $request->input('user', []);

            $model->fill($data);

            $password = $request->input('password');
            if ($password !== null && strlen($password = trim($password)) > 0) {
                $model->setPasswordAttribute($password);
            }

            $result = $model->save();
            $model->groups()
                ->sync($request->input('groups', []));

            if ($request->ajax()) {
                return new JsonResponse(['result' => $result]);
            }

            return Redirect::route('backend.backend.users.index');
        });
    }

    /**
     * @param $id
     *
     * @return View
     * @Permissions("system.users.write")
     */
    public function getEdit($id): View
    {
        return $this->view('users.form', [
            'model' => UserModel::query()->findOrFail($id),
        ]);
    }

    /**
     * @param              $id
     * @param  UsersRequest  $request
     *
     * @return Response
     * @Permissions("system.users.write")
     * @throws \Exception|\Throwable
     */
    public function postEdit($id, UsersRequest $request): Response
    {
        /**
         * @var UserModel $model
         */
        $model = UserModel::query()
            ->findOrFail($id);

        return $this->save($model, $request);
    }

    /**
     * @param $id
     *
     * @return JsonResponse
     * @throws \Exception
     * @Permissions("system.users.write")
     */
    public function anyDelete($id): JsonResponse
    {
        $result = UserModel::query()
            ->findOrFail($id)
            ->delete();

        return new JsonResponse(['result' => $result]);
    }
}
