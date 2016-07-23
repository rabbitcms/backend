<?php

namespace RabbitCMS\Backend\Annotation;

/**
 * Trait Permissions
 *
 * @package RabbitCMS\Support
 * @Annotation
 * @Target({"METHOD","CLASS"})
 * @Attributes({
 *   @Attribute("permissions", type="array", required=true),
 *   @Attribute("all", type="boolean")
 * })
 */
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
}
