<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Import;

use Psr\Log\LoggerInterface;

/**
 * Interface ImporterInterface
 * @package DtKt\Dealers\Support
 */
interface ImporterInterface extends LoggerInterface
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
     * @param \Closure $closure
     *
     * @return ImporterInterface
     */
    public function setTranslator(\Closure $closure): ImporterInterface;
}