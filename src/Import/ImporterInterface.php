<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Import;

/**
 * Interface ImporterInterface
 * @package DtKt\Dealers\Support
 */
interface ImporterInterface
{
    /**
     * Get next row.
     * @return array|null
     */
    public function head(): array;

    /**
     * @return array|null
     */
    public function next(): ?array;

    /**
     * @param \Closure $condition
     *
     * @return bool
     */
    public function probe(\Closure $condition):bool;

    /**
     * Log message like format of printf
     * @param string $format
     * @param mixed  ...$args
     */
    public function log(string $format, ...$args): void;
}