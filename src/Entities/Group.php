<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use RabbitCMS\Carrot\Eloquent\PrintableJson;

/**
 * Class Group
 *
 * @property-read int    $id
 * @property string      $caption
 * @property string[]    $permissions
 * @property-read User[] $users
 */
class Group extends Model
{
    use SoftDeletes, PrintableJson;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'backend_groups';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['caption', 'permissions'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = ['permissions' => 'array'];

    /**
     * @return BelongsToMany
     */
    public function users():BelongsToMany
    {
        return $this->belongsToMany(User::class, 'backend_users_groups', 'group_id', 'user_id');
    }

    /**
     * @return array
     */
    public function getPermissions(): array
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
