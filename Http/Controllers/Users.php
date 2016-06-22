<?php

namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Http\Request;
use RabbitCMS\Backend\Entities\Group as GroupModel;
use RabbitCMS\Backend\Entities\User as UserModel;
use RabbitCMS\Backend\Http\Requests\UsersRequest;

class Users extends Controller
{
    public function init()
    {
        \BackendMenu::setActive('system.users');
    }

    /**
     * @return \Illuminate\View\View
     */
    public function getIndex()
    {
        return $this->view('users.index');
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
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
        if (array_key_exists('active', $filters) && $filters['active'] !== '') {
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

        $result = [];
        foreach ($collection as $item) {
            $edit_link = relative_route('backend.backend.users.edit', ['id' => $item->id]);
            $edit_link_html = html_link($edit_link, '<i class="fa fa-pencil"></i>', ['rel' => 'ajax-portlet', 'class' => 'btn btn-sm green', 'title' => trans('backend::common.buttons.edit')]);

            $destroy_link = relative_route('backend.backend.users.destroy', ['id' => $item->id]);
            $destroy_link_html = html_link($destroy_link, '<i class="fa fa-trash-o"></i>', ['rel' => 'destroy', 'class' => 'btn btn-sm red', 'title' => trans('backend::common.buttons.destroy')]);

            $result[] = [
                $item->id,
                $item->name,
                $item->email,
                array_key_exists($item->active, $status) ? $status[$item->active] : $item->active,
                $edit_link_html . $destroy_link_html
            ];
        }

        $data = [
            'data'            => $result,
            'recordsTotal'    => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'draw'            => $request->input('draw')
        ];

        return \Response::json($data, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return \Illuminate\View\View
     */
    public function getCreate()
    {
        $data['model'] = new UserModel;

        return $this->form($data);
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
        $data['model'] = UserModel::query()
            ->findOrFail($id);

        return $this->form($data);
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
     * @param UserModel $model
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

    /**
     * @param array $data
     * @return \Illuminate\View\View
     */
    private function form(array $data = [])
    {
        $data['groups'] = GroupModel::query()
            ->get();

        return $this->view('users.form', $data);
    }

}
