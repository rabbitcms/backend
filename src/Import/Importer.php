<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Import;

use Psr\Log\LoggerTrait;
use RabbitCMS\Modules\Concerns\BelongsToModule;

/**
 * Class Importer
 * @package DtKt\Dealers\Support
 */
final class Importer implements ImporterInterface
{
    use BelongsToModule;
    use LoggerTrait;

    /**
     * @var \SplFileInfo
     */
    private $file;
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
     * @var int
     */
    private $line = 0;
    /**
     * @var null
     */
    private $head = null;

    private $log = [];
    /**
     * @var \Closure|null
     */
    private $translator = null;

    /**
     * @var null|array
     */
    private $current = null;

    /**
     * Importer constructor.
     *
     * @param \SplFileInfo $file
     * @param string       $encoding
     * @param string       $delimiter
     * @param array        $options
     */
    public function __construct(
        \SplFileInfo $file,
        string $encoding = 'utf-8',
        string $delimiter = ',',
        array $options = []
    ) {
        $this->file = $file->openFile();
        $this->encoding = $encoding;
        $this->delimiter = $delimiter;
        $this->options = $options;
    }

    /**
     * @param ImportInterface $import
     *
     * @return array
     */
    public function handle(ImportInterface $import): array
    {
        $this->file->rewind();
        $this->line = 0;
        $this->log = [];
        try {
            $import->init($this);
            while ($row = $this->next()) {
                if (count($row) === 1 && $row[0] === '') {
                    continue;
                }
                $import->row($row, $this);
            }
            $import->end($this);
        } catch (\Exception $e) {
            $import->catch($e, $this);
        }

        return $this->log;
    }

    /**
     * Get next row.
     * @return array|null
     * @throws \RuntimeException
     */
    public function head(): array
    {
        if ($this->head === null) {
            if ($this->line !== 0) {
                throw new \RuntimeException('Header already fetched');
            }
            $this->head = $this->next();
            if ($this->head === null) {
                throw new \RuntimeException('Empty file');
            }
        }

        return $this->head;
    }

    /**
     * @return array|null
     */
    public function next(): ?array
    {
        if (\is_array($this->current)) {
            $current = $this->current;
            $this->current = null;
            $this->line++;
            return $current;
        }
        if ($this->file->eof()) {
            return null;
        }
        $this->line++;
        return \array_map(function ($value) {
            return \iconv($this->encoding, 'UTF-8//IGNORE', \trim((string)$value));
        }, $this->file->fgetcsv($this->delimiter));
    }

    /**
     * @param \Closure $condition
     *
     * @return bool
     */
    public function probe(\Closure $condition): bool
    {
        $line = $this->line;
        $this->current = $this->next();
        $this->line = $line;
        if ($this->current === null) {
            return false;
        }
        return $condition($this->current);
    }

    /**
     * @param mixed  $level
     * @param string $message
     * @param array  $context
     */
    public function log($level, $message, array $context = array()): void
    {
        $this->log[] = [
            'level' => $level,
            'line' => $this->line,
            'message' => $this->translate($message),
            'context' => $context
        ];
    }

    /**
     * @param string $format
     * @param mixed  ...$args
     */
    public function log2(string $format, ...$args): void
    {
        $this->log[] = "{$this->line};" . sprintf($format, ...$args);
    }

    /**
     * @return array
     */
    public function getLog(): array
    {
        return $this->log;
    }

    private function translate(string $key): string
    {
        return $this->translator ? ($this->translator)($key) : $key;
    }

    public function setTranslator(\Closure $closure): ImporterInterface
    {
        $this->translator = $closure;
        return $this;
    }
}
