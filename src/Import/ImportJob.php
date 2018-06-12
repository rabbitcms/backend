<?php
declare(strict_types=1);

namespace RabbitCMS\Backend\Import;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Mail\Message;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\HtmlString;
use RabbitCMS\Backend\Entities\User;
use RabbitCMS\Modules\Concerns\BelongsToModule;

/**
 * Class ImportJob
 * @package DtKt\Dealers\Support
 */
class ImportJob implements ShouldQueue
{
    use Queueable;
    use SerializesModels;
    use Dispatchable;
    use BelongsToModule;

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

    /**
     * @param Mailer $mailer
     *
     * @return array
     */
    public function handle(Mailer $mailer): array
    {
        $file = new \SplFileInfo($this->path);
        $log = (new Importer($file, $this->encoding, $this->delimiter))
            ->handle(new $this->importClass($this->options));
        //@unlink($file->getPathname());
        $class = class_basename($this->importClass);
        if ($this->user) {
            $mailer->send(self::module()->viewName('mails.import'), [
                'class' => $class
            ], function (Message $message) use ($class, $log) {
                $message->to($this->user->email, $this->user->name);
                $message->subject("Import report: {$class}");
                $message->attachData(implode("\n", array_map(function (array $log) {
                    $level = strtoupper($log['level']);
                    $message = str_replace('"', '""', $log['message']);
                    $context = empty($context) ? str_replace('"', '""',
                        json_encode($log['context'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) : '';
                    return "\"{$log['line']}\";\"{$level}\";\"{$message}\";\"{$context}\"";
                }, $log)), 'report.csv');
            });
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
