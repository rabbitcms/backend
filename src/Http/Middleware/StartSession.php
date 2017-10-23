<?php
declare(strict_types=1);
namespace RabbitCMS\Backend\Http\Middleware;

use Illuminate\Config\Repository as ConfigRepository;
use Illuminate\Session\Middleware\StartSession as StartSessionMiddleware;
use Illuminate\Session\SessionManager;

/**
 * Class StartSession
 *
 * @package RabbitCMS\Backend\Http\Middleware
 */
class StartSession extends StartSessionMiddleware
{
    /**
     * @inheritdoc
     */
    public function __construct(SessionManager $manager, ConfigRepository $config)
    {
        $config->set('session.table', 'backend_sessions');
        $config->set('session.driver', 'database');
        $config->set('auth.defaults.guard', 'backend');
        parent::__construct($manager);
    }
}
