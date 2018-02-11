<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Support;

/**
 * Class Tab
 * @package RabbitCMS\Backend\Support
 */
class Tab
{
    /**
     * @var string
     */
    protected $label;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $view;

    /**
     * @var string|null
     */
    protected $exec;

    /**
     * @var array|\Closure
     */
    protected $data = [];

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
     * View constructor.
     *
     * @param string $name
     * @param string $label
     * @param string $view
     * @param array  $options
     */
    public function __construct(string $name, string $label, string $view, array $options = [])
    {
        $this->setName($name)
            ->setLabel($label)
            ->setView($view)
            ->setOptions($options);
    }

    /**
     * @param string $label
     *
     * @return self
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
     * @param string $name
     *
     * @return self
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param bool|\Closure $enabled
     *
     * @return self
     */
    public function setEnabled($enabled): self
    {
        $this->enabled = $enabled;

        return $this;
    }

    /**
     * @param null $object
     *
     * @return bool
     */
    public function isEnabled($object = null): bool
    {
        if (is_callable($this->enabled)) {
            return call_user_func($this->enabled, $object, $this);
        }
        return $this->enabled;
    }

    /**
     * @param int $priority
     *
     * @return self
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

        return $this;
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
     * @return string
     */
    public function getView(): string
    {
        return $this->view;
    }

    /**
     * @param array $permissions
     *
     * @param bool  $all
     *
     * @return self
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
     * @param null|string $exec
     *
     * @return Tab
     */
    public function setExec(?string $exec): Tab
    {
        $this->exec = $exec;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getExec(): ?string
    {
        return $this->exec;
    }

    /**
     * @param array|\Closure $data
     *
     * @return Tab
     */
    public function setData($data)
    {
        $this->data = $data;
        return $this;
    }

    /**
     * @param $object
     *
     * @return array
     */
    public function getData($object): array
    {
        if (\is_callable($this->data)) {
            return call_user_func($this->data, $object, $this);
        }
        return $this->data;
    }
}