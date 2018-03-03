<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Support;

/**
 * Class Action
 * @package RabbitCMS\Backend\Support
 */
class Action
{
    /**
     * @var string
     */
    protected $label;

    /**
     * @var array
     */
    protected $permissions = [];

    /**
     * @var bool
     */
    protected $permissionsAll = true;

    /**
     * @var bool
     */
    protected $enabled = true;

    /**
     * @var int
     */
    protected $priority = 0;

    /**
     * @var array|\Closure
     */
    protected $data = [];

    /**
     * @var string|null
     */
    protected $exec;

    /**
     * @var string|null
     */
    protected $icon;

    /**
     * @var string|null
     */
    protected $view;

    /**
     * View constructor.
     *
     * @param string $label
     * @param array  $options
     */
    public function __construct(string $label, array $options = [])
    {
        $this
            ->setLabel($label)
            ->setOptions($options);
    }

    /**
     * @param string $label
     *
     * @return static
     */
    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @param string $view
     *
     * @return self
     */
    public function setView(string $view): self
    {
        $this->view = $view;

        return $this;
    }

    /**
     * @param object $object
     *
     * @return string|null
     */
    public function getView($object): ?string
    {
        return $this->value($this->view, $object);
    }

    /**
     * @param bool|\Closure $enabled
     *
     * @return static
     */
    public function setEnabled($enabled): self
    {
        $this->enabled = $enabled;

        return $this;
    }

    /**
     * @param object $object
     *
     * @return bool
     */
    public function isEnabled($object): bool
    {
        return $this->value($this->enabled, $object);
    }

    /**
     * @param int $priority
     *
     * @return static
     */
    public function setPriority(int $priority): self
    {
        $this->priority = $priority;

        return $this;
    }

    /**
     * @return int
     */
    public function getPriority()
    {
        return $this->priority;
    }

    /**
     * @param array $permissions
     *
     * @param bool  $all
     *
     * @return static
     */
    public function setPermissions(array $permissions, bool $all = true): self
    {
        $this->permissions = $permissions;
        $this->permissionsAll = $all;

        return $this;
    }

    /**
     * @return array
     */
    public function getPermissions(): array
    {
        return $this->permissions;
    }

    /**
     * @return bool
     */
    public function isPermissionsAll(): bool
    {
        return $this->permissionsAll;
    }

    /**
     * @param array|\Closure $data
     *
     * @return static
     */
    public function setData($data): self
    {
        $this->data = $data;
        return $this;
    }

    /**
     * @param object $object
     *
     * @return array
     */
    public function getData($object): array
    {
        return $this->value($this->data, $object);
    }


    /**
     * @param \Closure|string|null $exec
     *
     * @return static
     */
    public function setExec($exec): self
    {
        $this->exec = $exec;
        return $this;
    }

    /**
     * @param object $object
     *
     * @return null|string
     */
    public function getExec($object): ?string
    {
        return $this->value($this->exec, $object);
    }

    /**
     * @param $value
     * @param $object
     *
     * @return mixed
     */
    protected function value($value, $object)
    {
        if (\is_callable($value)) {
            return call_user_func($value, $object, $this);
        }
        return $value;
    }

    /**
     * @param array $options
     *
     * @return self
     */
    public function setOptions(array $options): self
    {
        if (\array_key_exists('enabled', $options)) {
            $this->setEnabled($options['enabled']);
        }

        if (\array_key_exists('priority', $options)) {
            $this->setPriority($options['priority']);
        }

        if (\array_key_exists('permissions', $options)) {
            $this->setPermissions($options['permissions']);
        }

        if (\array_key_exists('exec', $options)) {
            $this->setExec($options['exec']);
        }

        if (\array_key_exists('icon', $options)) {
            $this->setIcon($options['icon']);
        }

        if (\array_key_exists('view', $options)) {
            $this->setView($options['view']);
        }

        if (\array_key_exists('data', $options)) {
            $this->setData($options['data']);
        }

        return $this;
    }

    /**
     * @param null|string $icon
     *
     * @return static
     */
    public function setIcon(?string $icon): self
    {
        $this->icon = $icon;
        return $this;
    }

    /**
     * @param object $object
     *
     * @return null|string
     */
    public function getIcon($object): ?string
    {
        return $this->value($this->icon, $object);
    }
}
