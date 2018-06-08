<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Import;

/**
 * Interface ImportInterface
 * @package DtKt\Dealers\Support
 */
interface ImportInterface
{
    /**
     * ImportInterface constructor.
     *
     * @param array $options
     */
    public function __construct(array $options = []);

    /**
     * @param ImporterInterface $importer
     *
     * @return mixed
     */
    public function init(ImporterInterface $importer): void;

    /**
     * @param array             $row
     * @param ImporterInterface $importer
     *
     * @return mixed
     */
    public function row(array $row, ImporterInterface $importer): void;

    /**
     * @param ImporterInterface $importer
     */
    public function end(ImporterInterface $importer): void;

    /**
     * @param \Exception        $exception
     * @param ImporterInterface $importer
     */
    public function catch(\Exception $exception, ImporterInterface $importer): void;
}