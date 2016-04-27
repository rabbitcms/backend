<?php

namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Contracts\Container\Container;
use Illuminate\Http\Request;
use RabbitCMS\Backend\Entities\Group as GroupModel;
use RabbitCMS\Backend\Entities\User as UserModel;
use RabbitCMS\Backend\Http\Requests\UsersRequest;
use RabbitCMS\Backend\Support\Metronic;
use RabbitCMS\Carrot\Http\ModuleController;

class Users extends ModuleController
{
    protected $module = 'backend';

    public function __construct(Container $app)
    {
        parent::__construct($app);
        Metronic::module(['datatable', 'validate', 'spinner']);

        Metronic::addPath(trans('System'), null);
    }

    /**
     * @return \Illuminate\View\View
     */
    public function getIndex()
    {
        Metronic::menu('system', 'users');

        return $this->view('users/index');
    }

    /**
     * @param Request $request
     * @return array
     */
    public function postIndex(Request $request)
    {
        $status = [0 => trans('backend::common.non_active'), 1 => trans('backend::common.active')];

        $query = UserModel::query();
        $recordsTotal = $query->count();

        $filters = $request->input('filter', []);
        if (!empty($filters['id'])) {
            $query->where('id', '=', $filters['id']);
        }
        if (isset($filters['active']) && $filters['active'] !== '') {
            $query->where('active', '=', $filters['active']);
        }
        if (!empty($filters['email'])) {
            (strpos($filters['email'], '%') !== false) ? $query->where('email', 'like',
                $filters['email']) : $query->where('email', '=', strtolower($filters['email']));
        }
        $recordsFiltered = $query->count();

        $query->limit($request->input('length', 25))
            ->offset($request->input('start', 0));

        $query->orderBy('id', 'desc');

        $collection = $query->get();

        $data = [];
        foreach ($collection as $item) {
            $data[] = [
                $item->id,
                $item->email,
                array_key_exists($item->active, $status) ? $status[$item->active] : $item->active,
                '<a href="' . route('backend.backend.users.edit', ['id' => $item->id]) . '" rel="ajax-portlet" class="btn btn-sm green" title="' . trans('backend::common.buttons.edit') . '"><i class="fa fa-pencil"></i></a> ' .
                '<a href="' . route('backend.backend.users.destroy', ['id' => $item->id]) . '" rel="destroy" class="btn btn-sm red" title="' . trans('backend::common.buttons.destroy') . '"><i class="fa fa-trash-o"></i></a>'
            ];
        }

        return [
            'data'            => $data,
            'recordsTotal'    => $recordsTotal,
            'recordsFiltered' => $recordsFiltered
        ];
    }

    /**
     * @return \Illuminate\View\View
     */
    public function getCreate()
    {
        $model = new UserModel;

        $groups = GroupModel::query()
            ->get();

        return $this->view('users.form', ['model' => $model, 'groups' => $groups]);
    }

    /**
     * @param UsersRequest $request
     * @return array|\Illuminate\Http\RedirectResponse
     */
    public function postCreate(UsersRequest $request)
    {
        $model = new UserModel;

        return $this->save($model, $request);
    }

    /**
     * @param $id
     * @return \Illuminate\View\View
     */
    public function getEdit($id)
    {
        $model = UserModel::query()
            ->findOrFail($id);

        $groups = GroupModel::query()
            ->get();

        return $this->view('users.form', ['model' => $model, 'groups' => $groups]);
    }

    /**
     * @param              $id
     * @param UsersRequest $request
     * @return array|\Illuminate\Http\RedirectResponse
     */
    public function postEdit($id, UsersRequest $request)
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
     * @return array
     * @throws \Exception
     */
    public function anyDelete($id)
    {
        $result = UserModel::query()
            ->findOrFail($id)
            ->delete();

        return ['result' => $result];
    }

    /**
     * @param UserModel    $model
     * @param UsersRequest $request
     * @return array|\Illuminate\Http\RedirectResponse
     */
    private function save(UserModel $model, UsersRequest $request)
    {
        return \DB::transaction(function () use ($model, $request) {
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
                return ['result' => $result];
            }

            return \Redirect::route('backend.backend.users');
        });
    }

}
