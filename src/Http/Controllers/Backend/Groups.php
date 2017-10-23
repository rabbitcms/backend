<?php
declare(strict_types=1);
namespace RabbitCMS\Backend\Http\Controllers\Backend;

use Illuminate\Contracts\View\View as ViewContract;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
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
     */
    public function before(): void
    {
        View::composer(self::module()->viewName('groups.form'), function (ViewContract $view) {
            $view->with('rules', app(Backend::class)->getAclGroups());
        });
    }

    /**
     * @return ViewContract
     */
    public function getIndex(): ViewContract
    {
        return self::module()->view('groups.index');
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function postIndex(Request $request): JsonResponse
    {
        return (new GroupsDataProvider())->response($request);
    }

    /**
     * @return ViewContract
     * @Permissions("system.groups.write")
     */
    public function getCreate(): ViewContract
    {
        $model = new GroupModel();

        return self::module()->view('groups.form', ['model' => $model]);
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     * @Permissions("system.groups.write")
     */
    public function postCreate(Request $request)
    {
        $model = new GroupModel();

        return $this->save($model, $request);
    }

    /**
     * @param string $id
     *
     * @return ViewContract
     * @Permissions("system.groups.write")
     */
    public function getEdit(string $id): ViewContract
    {
        $model = GroupModel::query()
            ->findOrFail($id);

        return self::module()->view('groups.form', ['model' => $model]);
    }

    /**
     * @param         $id
     * @param Request $request
     *
     * @return JsonResponse
     * @Permissions("system.groups.write")
     */
    public function postEdit(string $id, Request $request)
    {
        /* @var GroupModel $model */
        $model = GroupModel::query()
            ->findOrFail($id);

        return $this->save($model, $request);
    }

    /**
     * @param $id
     * @Permissions("system.groups.read")
     *
     * @throws \Exception
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
    protected function save(GroupModel $model, Request $request): JsonResponse
    {
        $data = $request->only('caption');
        $data['permissions'] = $request->input('permissions', []);

        $model->fill($data);
        $result = $model->save();

        return new JsonResponse(['result' => $result]);
    }

    /**
     * @param         $id
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getUsers($id, Request $request): JsonResponse
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
                    'delete' => route('backend.backend.groups.users.delete', [
                        'group_id' => $group->id,
                        'user_id'  => $item->id,
                    ]),
                ],
            ];
        }

        $data = [
            'data'            => $result,
            'recordsTotal'    => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'draw'            => $request->input('draw'),
        ];

        return new JsonResponse($data, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
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
