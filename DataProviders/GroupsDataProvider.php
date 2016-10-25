<?php

namespace RabbitCMS\Backend\DataProviders;


use Illuminate\Database\Eloquent\Model as Eloquent;
use RabbitCMS\Backend\Entities\Group as GroupEntity;
use RabbitCMS\Carrot\Support\Grid2 as BaseDataProvider;

class GroupsDataProvider extends BaseDataProvider
{
    public function getModel() :Eloquent
    {
        return new GroupEntity;
    }

    protected function prepareRow(Eloquent $row) :array
    {
        /* @var GroupEntity $row */

        $result = [
            'id'      => $row->id,
            'caption' => $row->caption,
            'actions' => [
                'edit'   => route('backend.backend.groups.edit', ['id' => $row->id]),
                'delete' => route('backend.backend.groups.delete', ['id' => $row->id]),
            ],
        ];

        return $result;
    }
}