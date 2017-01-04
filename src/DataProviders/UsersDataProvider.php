<?php

namespace RabbitCMS\Backend\DataProviders;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model as Eloquent;
use RabbitCMS\Backend\Entities\User as UserEntity;
use RabbitCMS\Carrot\Support\Grid2 as BaseDataProvider;

class UsersDataProvider extends BaseDataProvider
{
    public function getModel() :Eloquent
    {
        return new UserEntity;
    }

    protected function filters(Builder $query, array $filters) :Builder
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

    protected function prepareRow(Eloquent $row) :array
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