<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\Factory as ViewFactory;
use RabbitCMS\Backend\Annotation\Permissions;
use RabbitCMS\Backend\Entities\Group as GroupModel;
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
     * @param ViewFactory $view
     */
    public function init(Backend $backend, ViewFactory $view)
    {
        $backend->setActiveMenu('system.groups');
        $view->composer($this->viewName('groups.form'), function (View $view) use ($backend) {
            $view->with('rules', $backend->getAclGroups());
        });
    }

    /**
     * @return View
     */
    public function getIndex(): View
    {
        return $this->view('groups.index');
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function postIndex(Request $request): JsonResponse
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
            $edit_link_html = html_link($edit_link, '<i class="fa fa-pencil"></i>', [
                'rel' => 'ajax-portlet',
                'class' => 'btn btn-sm green',
                'title' => trans('backend::common.buttons.edit')
            ]);

            $destroy_link = html_link(relative_route('backend.backend.groups.destroy', [
                'id' => $item->id
            ]), '<i class="fa fa-trash-o"></i>', [
                'rel' => 'destroy',
                'class' => 'btn btn-sm red',
                'title' => trans('backend::common.buttons.destroy')
            ]);

            $result[] = [
                $item->id,
                $item->caption,
                $edit_link_html . $destroy_link
            ];
        }

        $data = [
            'data' => $result,
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'draw' => $request->input('draw')
        ];

        return new JsonResponse($data, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return View
     * @Permissions("system.groups.write")
     */
    public function getCreate(): View
    {
        return $this->view('groups.form', [
            'model' => new GroupModel
        ]);
    }

    /**
     * @param Request $request
     *
     * @return array|\Illuminate\Http\RedirectResponse
     * @Permissions("system.groups.write")
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

        return Redirect::route('backend.backend.groups.');
    }

    /**
     * @param $id
     *
     * @return View
     * @Permissions("system.groups.write")
     */
    public function getEdit($id): View
    {
        return $this->view('groups.form', [
            'model' => GroupModel::query()->findOrFail($id)
        ]);
    }

    /**
     * @param              $id
     * @param Request      $request
     *
     * @return array|\Illuminate\Http\RedirectResponse
     * @Permissions("system.groups.write")
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
     * @Permissions("system.groups.read")
     */
    public function anyDelete($id): array
    {
        $result = GroupModel::query()
            ->findOrFail($id)
            ->delete();

        return ['result' => $result];
    }

    /**
     * @param         $id
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getUsers($id, Request $request):JsonResponse
    {
        /**
         * @var GroupModel $group
         */
        $group = GroupModel::query()
            ->findOrFail($id);

        $query = $group->users()->getQuery();
        $recordsFiltered = $recordsTotal = $query->count();

        $query->limit($request->input('length', 25))
            ->offset($request->input('start', 0));

        $query->orderBy('id', 'desc');

        $collection = $query->get();

        $result = [];
        foreach ($collection as $item) {
            $destroy_link = html_link(relative_route('backend.backend.groups.dissociate', [
                'group_id' => $group->id,
                'user_id' => $item->id
            ]), '<i class="fa fa-trash-o"></i>', [
                'rel' => 'destroy',
                'class' => 'btn btn-sm red',
                'title' => trans('backend::common.buttons.destroy')
            ]);

            $result[] = [
                $item->id,
                $item->email . (empty($item->name) ? '' : ' - ' . $item->name),
                $destroy_link
            ];
        }

        $data = [
            'data' => $result,
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'draw' => $request->input('draw')
        ];

        return new JsonResponse($data, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param $group_id
     * @param $user_id
     * @Permissions("system.users.write")
     */
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
