<?php

declare(strict_types=1);

namespace RabbitCMS\Backend\Annotation;

/**
 * @Annotation
 * @Target({"METHOD","CLASS"})
 * @Attributes({
 *   @Attribute("value", type="array", required=true),
 *   @Attribute("all", type="boolean")
 * })
 */
#[\Attribute(\Attribute::TARGET_CLASS | \Attribute::TARGET_METHOD)]
final class Permissions
{
    /**
     * @var array
     */
    public $permissions;

    /**
     * @var bool
     */
    public $all = true;

    /**
     * Permissions constructor.
     * @param  string[]|string  $permissions
     * @param  bool  $all
     */
    public function __construct($permissions, bool $all = true)
    {
        if (is_array($permissions) && array_key_exists('value', $permissions)) {
            $all = (bool)($permissions['all'] ?? true);
            $permissions = $permissions['value'];
        }
        $this->permissions = (array) $permissions;
        $this->all = $all;
    }


}
