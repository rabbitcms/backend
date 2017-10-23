<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Entities;

use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Hash;
use RabbitCMS\Backend\Contracts\HasAccessEntity;

/**
 * Class User
 *
 * @property-read int     $id
 * @property string       $email
 * @property boolean      $active
 * @property string       $name
 * @property-write string $password
 * @property-read Group[] $groups
 */
class User extends Eloquent
    implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract, HasAccessEntity
{
    use Authenticatable, Authorizable, CanResetPassword, SoftDeletes;

    /**
     * {@inheritdoc}
     */
    protected $table = 'backend_users';

    /**
     * {@inheritdoc}
     */
    protected $fillable = ['email', 'active', 'password', 'name'];

    /**
     * {@inheritdoc}
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * Merged permissions
     *
     * @var array
     */
    protected $mergedPermissions;

    /**
     * Encode password for user
     *
     * @param string
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    /**
     * @return BelongsToMany
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'backend_users_groups', 'user_id', 'group_id');
    }

    /**
     * Returns if the user has access to any of the given permissions.
     *
     * @param  array $permissions
     *
     * @return bool
     */
    public function hasAnyAccess(array $permissions): bool
    {
        return $this->hasAccess($permissions, false);
    }

    /**
     * See if a user has access to the passed permission(s).
     * Permissions are merged from all groups the user belongs to
     * and then are checked against the passed permission(s).
     * If multiple permissions are passed, the user must
     * have access to all permissions passed through, unless the
     * "all" flag is set to false.
     *
     * @param  string|array $permissions
     * @param  bool         $all
     *
     * @return bool
     */
    public function hasAccess($permissions, $all = true): bool
    {
        $allPermissions = $this->getPermissions();

        if (!is_array($permissions)) {
            $permissions = [$permissions];
        }

        $match = false;

        foreach ($permissions as $permission) {
            //todo temporary check key(old permissions)
            if (array_key_exists($permission, $allPermissions) || in_array($permission, $allPermissions)) {
                $match = true;
            } elseif ($all) {
                return false;
            }
        }

        return $match;
    }

    /**
     * @inheritdoc
     */
    public function getPermissions()
    {
        /**
         * @var Group $group
         */
        if (!$this->mergedPermissions) {
            $permissions = [[]];

            foreach ($this->groups as $group) {
                if (!is_array($p = $group->getPermissions())) {
                    continue;
                }

                $permissions[] = $p;
            }
            $this->mergedPermissions = call_user_func_array('array_merge', $permissions);
        }

        return $this->mergedPermissions;
    }
}
