<?php

namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Http\Request;
use RabbitCMS\Backend\Entities\Group as GroupModel;

class Groups extends Controller
{
    public function init()
    {
        \BackendMenu::setActive('system.groups');
    }

    /**
     * @return \Illuminate\View\View
     */
    public function getIndex()
    {
        return $this->view('groups.index');
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postIndex(Request $request)
    {
        $query = GroupModel::query();
        $recordsFiltered = $recordsTotal = $query->count();

        $query->limit($request->input('length', 25))
            ->offset($request->input('start', 0));

        $query->orderBy('id', 'desc');

        $collection = $query->get();

        $result = [];
        foreach ($collection as $item) {
            $edit_link = relative_route('backend.backend.groups.edit', ['id' => $item->id]);
            $edit_link_html = html_link($edit_link, '<i class="fa fa-pencil"></i>', ['rel' => 'ajax-portlet', 'class' => 'btn btn-sm green', 'title' => trans('backend::common.buttons.edit')]);

            $destroy_link = relative_route('backend.backend.groups.destroy', ['id' => $item->id]);
            $destroy_link_html = html_link($destroy_link, '<i class="fa fa-trash-o"></i>', ['rel' => 'destroy', 'class' => 'btn btn-sm red', 'title' => trans('backend::common.buttons.destroy')]);

            $result[] = [
                $item->id,
                $item->caption,
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
        $data['model'] = new GroupModel;

        return $this->form($data);
    }

    /**
     * @param Request $request
     *
     * @return array|\Illuminate\Http\RedirectResponse
     */
    public function postCreate(Request $request)
    {
        $model = new GroupModel;

        return $this->save($model, $request);
    }

    /**
     * @param $id
     *
     * @return \Illuminate\View\View
     */
    public function getEdit($id)
    {
        $data['model'] = GroupModel::query()
            ->findOrFail($id);

        return $this->form($data);
    }

    /**
     * @param              $id
     * @param Request $request
     *
     * @return array|\Illuminate\Http\RedirectResponse
     */
    public function postEdit($id, Request $request)
    {
        /**
         * @var GroupModel $model
         */
        $model = GroupModel::query()
            ->findOrFail($id);

        return $this->save($model, $request);
    }

    /**
     * @param $id
     *
     * @return array
     * @throws \Exception
     */
    public function anyDelete($id)
    {
        $result = GroupModel::query()
            ->findOrFail($id)
            ->delete();

        return ['result' => $result];
    }

    /**
     * @param GroupModel $model
     * @param Request $request
     *
     * @return array|\Illuminate\Http\RedirectResponse
     */
    private function save(GroupModel $model, Request $request)
    {
        $data = $request->input('groups', []);
        $permissions = $request->input('permissions', []);
        $data['permissions'] = $permissions;

        $model->fill($data);
        $result = $model->save();

        if ($request->ajax()) {
            return ['result' => $result];
        }

        return \Redirect::route('backend.backend.groups');
    }

    /**
     * @param array $data
     * @return \Illuminate\View\View
     */
    private function form(array $data = [])
    {
        $data['rules'] = \BackendAcl::getGroups();

        return $this->view('groups.form', $data);
    }

    /**
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers($id, Request $request)
    {
        /**
         * @var GroupModel $group
         */
        $group = GroupModel::query()
            ->findOrFail($id);

        $query = $group->users();
        $recordsFiltered = $recordsTotal = $query->count();

        $query->limit($request->input('length', 25))
            ->offset($request->input('start', 0));

        $query->orderBy('id', 'desc');

        $collection = $query->get();

        $result = [];
        foreach ($collection as $item) {
            $destroy_link = relative_route('backend.backend.groups.users.destroy', ['group_id' => $group->id, 'user_id' => $item->id]);
            $destroy_link_html = html_link($destroy_link, '<i class="fa fa-trash-o"></i>', ['rel' => 'destroy', 'class' => 'btn btn-sm red', 'title' => trans('backend::common.buttons.destroy')]);

            $result[] = [
                $item->id,
                $item->email . (empty($item->name) ? '' : ' - ' . $item->name),
                $destroy_link_html
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

    public function destroyUser($group_id, $user_id)
    {
        /**
         * @var GroupModel $group
         */
        $group = GroupModel::query()
            ->findOrFail($group_id);

        $group->users()
            ->detach($user_id);
    }

}
