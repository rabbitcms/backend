<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Support;

/**
 * Class Tab
 * @package RabbitCMS\Backend\Support
 */
class Tab extends Action
{
    /**
     * @var string
     */
    protected $name;

    /**
     * Tab constructor.
     *
     * @param string $name
     * @param string $label
     * @param string $view
     * @param array  $options
     */
    public function __construct(string $name, string $label, string $view, array $options = [])
    {
        parent::__construct($label, $options);

        $this->setName($name)
            ->setView($view);
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
}
