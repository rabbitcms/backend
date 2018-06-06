<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use RabbitCMS\Backend\Contracts\HasAccessEntity;
use RabbitCMS\Carrot\Support\Grid2;
use RabbitCMS\Modules\Concerns\BelongsToModule;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Class SimpleCRUDController
 * @package RabbitCMS\Backend\Http\Controllers
 */
abstract class SimpleCRUDController extends Controller
{
    use BelongsToModule;

    /**
     * @return Model
     */
    abstract protected function getModel(): Model;

    /**
     * @return Builder
     */
    protected function getQuery(): Builder
    {
        return $this->getModel()->newQuery();
    }

    /**
     * @return Grid2
     */
    abstract protected function getDataProvider(): Grid2;

    /**
     * @return string
     */
    abstract protected function getTemplateName(): string;

    /**
     * @return array
     */
    abstract protected function getACL(): array;

    /**
     * @param Model $model
     */
    protected function checkDelete(Model $model): void
    {
        //do nothing
    }

    protected function getRules(Model $model): array
    {
        return [];
    }

    /**
     * @param string[]|string[][] ...$types
     *
     * @throws AccessDeniedHttpException
     */
    private function checkACL(...$types): void
    {
        /** @var HasAccessEntity $user */
        $user = Auth::guard('backend')->user();
        $acl = $this->getACL();
        $deny = false;
        foreach ($types as $type) {
            if (!array_key_exists($type, $acl)) {
                continue;
            }
            $deny = true;
            if ($user->hasAccess($acl[$type], true)) {
                return;
            }
        }
        if ($deny) {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * @param string $method
     * @param array  $parameters
     *
     * @return SymfonyResponse
     * @throws AccessDeniedHttpException
     */
    public function callAction($method, $parameters)
    {
        $this->checkACL('all');
        return parent::callAction($method, $parameters);
    }


    /**
     * @param Request $request
     *
     * @return SymfonyResponse
     * @throws AccessDeniedHttpException
     */
    public function index(Request $request): SymfonyResponse
    {
        $this->checkACL('read');
        if ($request->has('draw')) {
            return $this->getDataProvider()->response($request);
        } else {
            return new Response(
                View::make(static::module()->viewName("backend.{$this->getTemplateName()}.table"))->render()
            );
        }
    }

    /**
     * @param string $id
     *
     * @return Response
     * @throws AccessDeniedHttpException
     */
    public function get(string $id): Response
    {
        $this->checkACL('read', 'write', 'update');
        $model = $this->getQuery()->findOrFail($id);
        return new Response(View::make(
            static::module()->viewName("backend.{$this->getTemplateName()}.form"),
            ['model' => $model]
        )->render());
    }

    /**
     * @param Model   $model
     * @param Request $request
     *
     * @return mixed
     */
    protected function save(Model $model, Request $request)
    {
        $data = $request->validate($this->getRules($model) +
            [
                'flags' => ['array'],
                'flags.*' => ['array'],
                'flags.*.*' => ['int'],
                'relations' => ['array'],
                'options' => ['array']
            ]
        );

        unset($data['flags'], $data['relations']);

        foreach ($request->input('flags', []) as $name => $flags) {
            $data[$name] = array_reduce(array_map('\intval', (array)$flags), function (int $flags, int $flag) {
                return $flags | $flag;
            }, 0);
        }

        $model->fill(Arr::only($data, $model->getFillable()));

        foreach ($request->input('relations', []) as $method => $value) {
            /** @var BelongsTo $relation */
            $relation = $model->{$method}();

            if (!($relation instanceof BelongsTo)) {
                throw new LogicException(get_class($model) . '::' . $method . ' must return a belongs to instance.');
            }
            $relation->dissociate();
            if (!empty($value)) {
                $relatedModel = $relation->getModel()->newQuery()->withoutGlobalScopes()->findOrFail($value);
                $relation->associate($relatedModel);
            }
        }

        $model->save();

        return $model;
    }

    /**
     * @return Response
     * @throws AccessDeniedHttpException
     */
    public function create(): Response
    {
        $this->checkACL('write', 'create');
        return new Response(View::make(
            self::module()->viewName("backend.{$this->getTemplateName()}.form"),
            ['model' => $this->getModel()]
        )->render());
    }

    /**
     * @param string  $id
     * @param Request $request
     *
     * @return mixed
     * @throws AccessDeniedHttpException
     */
    public function put(string $id, Request $request)
    {
        $this->checkACL('write', 'update');
        $model = $this->getQuery()->findOrFail($id);

        return $this->save($model, $request);
    }

    /**
     * @param Request $request
     *
     * @return mixed
     * @throws AccessDeniedHttpException
     */
    public function post(Request $request)
    {
        $this->checkACL('write', 'create');
        return $this->save($this->getModel(), $request);
    }

    /**
     * @param string $id
     *
     * @return JsonResponse
     * @throws \Exception
     */
    public function delete(string $id): JsonResponse
    {
        $this->checkACL('write', 'delete');
        $model = $this->getQuery()->findOrFail($id);

        $this->checkDelete($model);

        $model->delete();
        return new JsonResponse(null);
    }

}
