<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\DataProviders;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model as Eloquent;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Carrot\Support\Grid2 as BaseDataProvider;

/**
 * Class UsersDataProvider
 *
 * @package RabbitCMS\Backend\DataProviders
 */
class UsersDataProvider extends BaseDataProvider
{
    /**
     * @return Eloquent
     */
    public function getModel(): Eloquent
    {
        return new UserEntity();
    }

    /**
     * @param Builder $query
     * @param array   $filters
     *
     * @return Builder
     */
    protected function filters(Builder $query, array $filters): Builder
    {
        if (array_key_exists('id', $filters) && $filters['id'] !== '') {
            $query->where('id', '=', $filters['id']);
        }
        if (array_key_exists('active', $filters) && $filters['active'] !== '') {
            $query->where('active', '=', $filters['active']);
        }
        if (array_key_exists('email', $filters) && $filters['email'] !== '') {
            (strpos($filters['email'], '%') !== false) ? $query->where('email', 'like', $filters['email'])
                : $query->where('email', '=', strtolower($filters['email']));
        }

        return $query;
    }

    /**
     * @param Eloquent $row
     *
     * @return array
     */
    protected function prepareRow(Eloquent $row): array
    {
        /* @var UserEntity $row */

        $result = [
            'id'      => $row->id,
            'name'    => $row->name,
            'email'   => $row->email,
            'status'  => trans('backend::users.status_' . (int)$row->active),
            'actions' => [
                'edit'   => route('backend.backend.users.edit', ['id' => $row->id]),
                'delete' => route('backend.backend.users.delete', ['id' => $row->id]),
            ],
        ];

        return $result;
    }
}
