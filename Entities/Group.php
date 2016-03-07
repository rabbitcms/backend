<?php namespace RabbitCMS\Backend\Entities;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Group
 *
 * @property-read int    $id
 * @property string      $caption
 * @property array       $permissions
 * @property-read User[] $users
 */
class Group extends Model
{
    protected $table = 'backend_groups';
    protected $fillable
        = [
            'caption',
            'permissions',
        ];

    protected $casts
        = [
            'permissions' => 'array',
        ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'backend_users_groups', 'group_id', 'user_id');
    }

    /**
     * @return array
     */
    public function getPermissions()
    {
        return $this->permissions ?: [];
    }

    /**
     * @param array $permissions
     */
    protected function setPermissions(array $permissions)
    {
        $this->permissions = $permissions;
    }
}