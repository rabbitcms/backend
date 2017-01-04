<?php

namespace RabbitCMS\Backend\Http\Controllers\Backend;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\Factory as ViewFactory;
use Illuminate\View\View;
use RabbitCMS\Backend\Annotation\Permissions;
use RabbitCMS\Backend\DataProviders\GroupsDataProvider;
use RabbitCMS\Backend\Entities\Group as GroupModel;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Backend\Support\Backend;

/**
 * Class Groups.
 * @Permissions("system.groups.read")
 */
class Groups extends Controller
{
    /**
     * Init controller.
     *
     * @param Backend     $backend
     * @param ViewFactory $factory
     */
    public function init(Backend $backend, ViewFactory $factory)
    {
        $factory->composer(
            $this->viewName('groups.form'),
            function (View $view) use ($backend) {
                $view->with('rules', $backend->getAclGroups());
            }
        );
    }

    /**
     * @return View
     */
    public function getIndex()
    {
        return $this->view('groups.index');
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function postIndex(Request $request)
    {
        return (new GroupsDataProvider)->response($request);
    }

    /**
     * @return View
     * @Permissions("system.groups.write")
     */
    public function getCreate()
    {
        $model = new GroupModel;

        return $this->view('groups.form', ['model' => $model]);
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     * @Permissions("system.groups.write")
     */
    public function postCreate(Request $request)
    {
        $model = new GroupModel;

        return $this->save($model, $request);
    }

    /**
     * @param $id
     *
     * @return View
     * @Permissions("system.groups.write")
     */
    public function getEdit($id)
    {
        $model = GroupModel::query()
            ->findOrFail($id);

        return $this->view('groups.form', ['model' => $model]);
    }

    /**
     * @param         $id
     * @param Request $request
     *
     * @return JsonResponse
     * @Permissions("system.groups.write")
     */
    public function postEdit($id, Request $request)
    {
        /* @var GroupModel $model */
        $model = GroupModel::query()
            ->findOrFail($id);

        return $this->save($model, $request);
    }

    /**
     * @param $id
     * @Permissions("system.groups.read")
     */
    public function postDelete($id)
    {
        $result = GroupModel::query()
            ->findOrFail($id)
            ->delete();

        if ($result) {
            $this->success(trans('backend::common.deleting_ok'));
        }

        $this->error(trans('backend::common.deleting_error'));
    }

    /**
     * @param GroupModel $model
     * @param Request    $request
     *
     * @return JsonResponse
     */
    protected function save(GroupModel $model, Request $request)
    {
        $data = $request->only('caption');
        $data['permissions'] = $request->input('permissions', []);

        $model->fill($data);
        $result = $model->save();

        return \Response::json(['result' => $result]);
    }

    /**
     * @param         $id
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getUsers($id, Request $request)
    {
        /* @var GroupModel $group */
        $group = GroupModel::query()
            ->findOrFail($id);

        /* @var $query Builder */
        $query = $group->users();

        $recordsFiltered = $recordsTotal = $query->count();

        $query->limit($request->input('length', 25))
            ->offset($request->input('start', 0));

        $query->orderBy('id', 'desc');

        /* @var UserEntity[] $collection */
        $collection = $query->get();

        $result = [];
        foreach ($collection as $item) {
            $result[] = [
                'id'      => $item->id,
                'name'    => $item->email . ($item->name === '' ? '' : ' - ' . $item->name),
                'actions' => [
                    'delete' => route('backend.backend.groups.users.delete', ['group_id' => $group->id, 'user_id' => $item->id]),
                ],
            ];
        }

        $data = [
            'data'            => $result,
            'recordsTotal'    => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'draw'            => $request->input('draw'),
        ];

        return \Response::json($data, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param $group_id
     * @param $user_id
     * @Permissions("system.users.write")
     */
    public function postDeleteUser($group_id, $user_id)
    {
        /* @var GroupModel $group */
        $group = GroupModel::query()
            ->findOrFail($group_id);

        $group->users()
            ->detach($user_id);
    }
}
