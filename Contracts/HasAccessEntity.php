<?php

namespace RabbitCMS\Backend\Contracts;

interface HasAccessEntity
{
    /**
     * See if a user has access to the passed permission(s).
     * Permissions are merged from all groups the user belongs to
     * and then are checked against the passed permission(s).
     * If multiple permissions are passed, the user must
     * have access to all permissions passed through, unless the
     * "all" flag is set to false.
     * Super users DON'T have access no matter what.
     *
     * @param  string|array $permissions
     * @param  bool         $all
     *
     * @return bool
     */
    public function hasAccess($permissions, $all = true);

    /**
     * Returns an array of merged permissions for each group the user is in.
     *
     * @return string[]
     */
    public function getPermissions();
}