<?php namespace RabbitCMS\Backend\Entities;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Support\Facades\Hash;
use RabbitCMS\Carrot\Support\PermissionsTrait;

/**
 * Class User
 *
 * @property-read int     $id
 * @property string       $email
 * @property boolean      $active
 * @property-write string $password
 *
 * @property-read Group[] $groups
 */
class User extends Eloquent implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword, PermissionsTrait;

    protected $table = 'backend_users';

    protected $fillable
        = [
            'email',
            'active',
            'password',
        ];

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
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'backend_users_groups', 'user_id','group_id');
    }

    /**
     * Returns an array of merged permissions for each group the user is in.
     *
     * @return array
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