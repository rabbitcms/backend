<?php

namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Http\Request;
use RabbitCMS\Backend\Entities\Group as GroupModel;
use RabbitCMS\Backend\Support\Metronic;

class Groups extends Controller
{
    public function init()
    {
        Metronic::addPath(trans('System'), null);
    }

    /**
     * @return \Illuminate\View\View
     */
    public function getIndex()
    {
        Metronic::menu('system', 'groups');

        return $this->view('groups.index');
    }

    /**
     * @param Request $request
     *
     * @return array
     */
    public function postIndex(Request $request)
    {
        $query = GroupModel::query();
        $recordsFiltered = $recordsTotal = $query->count();

        $query->limit($request->input('length', 25))
            ->offset($request->input('start', 0));

        $query->orderBy('id', 'desc');

        $collection = $query->get();

        $data = [];
        foreach ($collection as $item) {
            $data[] = [
                $item->id,
                $item->caption,
                '<a href="' . route('backend.backend.groups.edit', ['id' => $item->id]) . '" rel="ajax-portlet" class="btn btn-sm green" title="'
                . trans('backend::common.buttons.edit') . '"><i class="fa fa-pencil"></i></a> ' .
                '<a href="' . route('backend.backend.groups.destroy', ['id' => $item->id]) . '" rel="destroy" class="btn btn-sm red" title="'
                . trans('backend::common.buttons.destroy') . '"><i class="fa fa-trash-o"></i></a>'
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
        $model = new GroupModel;

        $rules = \BackendAcl::getAcl();

        return $this->view('groups.form', ['model' => $model, 'rules' => $rules]);
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
     * @param GroupModel $model
     * @param Request    $request
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
     * @param $id
     *
     * @return \Illuminate\View\View
     */
    public function getEdit($id)
    {
        $model = GroupModel::query()
            ->findOrFail($id);

        $rules = \BackendAcl::getAcl();

        return $this->view('groups.form', ['model' => $model, 'rules' => $rules]);
    }

    /**
     * @param              $id
     * @param Request      $request
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

}
