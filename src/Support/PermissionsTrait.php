<?php

namespace RabbitCMS\Backend\Support;

use Exception;
use InvalidArgumentException;

/**
 * Class Permissions
 *
 * @package App\Models\Traits
 * @property array $permissions
 * @mixed   Illuminate\Database\Eloquent\Model
 */
trait PermissionsTrait
{
    /**
     * Returns an array of merged permissions for each group the user is in.
     *
     * @return array Array of permissions.
     * @throws Exception
     */
    public function getPermissions()
    {
        throw new Exception(__METHOD__ . ' not implemented.');
    }

    /**
     * Returns if the user has access to any of the given permissions.
     *
     * @param  array $permissions
     *
     * @return bool
     */
    public function hasAnyAccess(array $permissions)
    {
        return $this->hasAccess($permissions, false);
    }

    /**
     * See if a user has access to the passed permission(s).
     * Permissions are merged from all groups the user belongs to
     * and then are checked against the passed permission(s).
     *
     * If multiple permissions are passed, the user must
     * have access to all permissions passed through, unless the
     * "all" flag is set to false.
     *
     * Super users DON'T have access no matter what.
     *
     * @param  string|array $permissions
     * @param  bool $all
     *
     * @return bool
     */
    public function hasAccess($permissions, $all = true)
    {
        $allPermissions = $this->getPermissions();

        if (!is_array($permissions)) {
            $permissions = [$permissions];
        }

        foreach ($permissions as $permission) {
            // Now, let's check if the permission ends in a wildcard "*" symbol.
            // If it does, we'll check through all the merged permissions to see
            // if a permission exists which matches the wildcard.
            if ((strlen($permission) > 1) && ends_with($permission, '*')) {
                $matched = false;

                foreach ($allPermissions as $mergedPermission => $value) {
                    // Strip the '*' off the end of the permission.
                    $checkPermission = substr($permission, 0, -1);

                    // We will make sure that the merged permission does not
                    // exactly match our permission, but starts with it.
                    if ($checkPermission != $mergedPermission && starts_with($mergedPermission,
                            $checkPermission) && $value == 1
                    ) {
                        $matched = true;
                        break;
                    }
                }
            } elseif ((strlen($permission) > 1) && starts_with($permission, '*')) {
                $matched = false;

                foreach ($allPermissions as $mergedPermission => $value) {
                    // Strip the '*' off the beginning of the permission.
                    $checkPermission = substr($permission, 1);

                    // We will make sure that the merged permission does not
                    // exactly match our permission, but ends with it.
                    if ($checkPermission != $mergedPermission
                        && ends_with($mergedPermission, $checkPermission)
                        && $value == 1
                    ) {
                        $matched = true;
                        break;
                    }
                }
            } else {
                $matched = false;

                foreach ($allPermissions as $mergedPermission => $value) {
                    // This time check if the mergedPermission ends in wildcard "*" symbol.
                    if ((strlen($mergedPermission) > 1) && ends_with($mergedPermission, '*')) {
                        $matched = false;

                        // Strip the '*' off the end of the permission.
                        $checkMergedPermission = substr($mergedPermission, 0, -1);

                        // We will make sure that the merged permission does not
                        // exactly match our permission, but starts with it.
                        if ($checkMergedPermission != $permission
                            && starts_with($permission, $checkMergedPermission)
                            && $value == 1
                        ) {
                            $matched = true;
                            break;
                        }
                    }

                    // Otherwise, we'll fallback to standard permissions checking where
                    // we match that permissions explicitly exist.
                    elseif ($permission == $mergedPermission
                        && $allPermissions[$permission] == 1
                    ) {
                        $matched = true;
                        break;
                    }
                }
            }

            // Now, we will check if we have to match all
            // permissions or any permission and return
            // accordingly.
            if ($all === true && $matched === false) {
                return false;
            } elseif ($all === false && $matched === true) {
                return true;
            }
        }

        if ($all === false) {
            return false;
        }

        return true;
    }

    /**
     * Validate the permissions when set.
     *
     * @param  array $permissions
     *
     * @return void
     * @throw InvalidArgumentException
     */
    public function storePermissions(array $permissions)
    {
        $allowedPermissionsValues = $this->getAllowedPermissionsValues();
        foreach ($permissions as $permission => $value) {
            if (!in_array($value = (int)$value, $allowedPermissionsValues)) {
                throw new InvalidArgumentException(sprintf('Invalid value "%s" for permission "%s" given.',
                    $value, $permission));
            }

            if ($value === 0) {
                unset($permissions[$permission]);
            }
        }

        $this->setPermissions($permissions);
    }

    /**
     * Allowed permissions values.
     *
     * Possible options:
     *   -1 => Deny (adds to array, but denies regardless of user's group).
     *    0 => Remove.
     *    1 => Add.
     *
     * @return array
     */
    public function getAllowedPermissionsValues()
    {
        return [0, 1];
    }

    /**
     * Save permissions to model
     *
     * @param array $permissions
     *
     * @return void
     * @throws Exception
     */
    protected function setPermissions(array $permissions)
    {
        throw new Exception(__METHOD__ . ' not implemented.');
    }
}