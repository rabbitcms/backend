<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Import;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use RabbitCMS\Backend\Entities\User;

/**
 * Class ImportJob
 * @package DtKt\Dealers\Support
 */
class ImportJob implements ShouldQueue
{
    use Queueable;
    use SerializesModels;
    use Dispatchable;

    /**
     * @var string
     */
    private $importClass;
    /**
     * @var \SplFileInfo
     */
    private $path;
    /**
     * @var string
     */
    private $encoding;
    /**
     * @var string
     */
    private $delimiter;
    /**
     * @var array
     */
    private $options;

    /**
     * @var User
     */
    private $user;

    /**
     * ImportJob constructor.
     *
     * @param string       $importClass
     * @param \SplFileInfo $file
     * @param string       $encoding
     * @param string       $delimiter
     * @param array        $options
     */
    public function __construct(
        string $importClass,
        \SplFileInfo $file,
        string $encoding = 'utf-8',
        string $delimiter = ',',
        array $options = []
    ) {
        if (!class_exists($importClass)) {
            throw new \RuntimeException("Class '{$importClass}' not found");
        }
        if (!is_a($importClass, ImportInterface::class, true)) {
            throw new \RuntimeException("Class '{$importClass}' not found");
        }
        $this->importClass = $importClass;
        $this->path = $file->getPathname();
        $this->encoding = $encoding;
        $this->delimiter = $delimiter;
        $this->options = $options;
    }

    public function handle(): array
    {
        $log = (new Importer(new \SplFileInfo($this->path), $this->encoding, $this->delimiter))
            ->handle(new $this->importClass($this->options));
        if ($this->user) {
            //todo send log.
        }
        return $log;
    }

    /**
     * @param User $user
     *
     * @return ImportJob
     */
    public function setUser(User $user): ImportJob
    {
        $this->user = $user;
        return $this;
    }
}
