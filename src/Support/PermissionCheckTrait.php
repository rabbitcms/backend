<?php

namespace RabbitCMS\Backend\Support;

use Doctrine\Common\Annotations\AnnotationReader;
use Illuminate\Routing\Controller;
use RabbitCMS\Backend\Annotation\Permissions;
use RabbitCMS\Backend\Contracts\HasAccessEntity;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Class PermissionCheckTrait
 *
 * @package RabbitCMS\Backend
 * @mixin Controller
 */
trait PermissionCheckTrait
{
    /**
     * Execute an action on the controller.
     *
     * @param  string $method
     * @param  array $parameters
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function callAction($method, $parameters)
    {
        /**
         * @var HasAccessEntity|PermissionsTrait|null $user
         * @var Permissions $annotation
         */
        try {
            $user = \Auth::guard(property_exists($this, 'guard') ? $this->guard : null)->user();
            $reader = new AnnotationReader();
            $class = new \ReflectionClass($this);
            $annotation = $reader->getClassAnnotation($class, Permissions::class);

            if ($annotation instanceof Permissions) {
                if ($user instanceof HasAccessEntity) {
                    if (!$user->hasAccess($annotation->permissions, $annotation->all)) {
                        throw new AccessDeniedHttpException;
                    }
                } else {
                    throw new \RuntimeException('User must implements HasAccessEntity');
                }
            }

            $method = $class->getMethod($method);
            $annotation = $reader->getMethodAnnotation($method, Permissions::class);
            if ($annotation instanceof Permissions) {
                if ($user instanceof HasAccessEntity) {
                    if (!$user->hasAccess($annotation->permissions, $annotation->all)) {
                        throw new AccessDeniedHttpException;
                    }
                } else {
                    throw new \RuntimeException('User must implements HasAccessEntity');
                }
            }
        } catch (AccessDeniedHttpException $e) {
            if (\Request::ajax()) {
                return \Response::json(
                    [
                        'error' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                    ],
                    403,
                    [],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                );
            } else {
                return view(property_exists($this, 'denyView') ? $this->denyView : 'deny');
            }
        }

        return $method->invokeArgs($this, $parameters);
    }
}