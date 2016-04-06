<?php
namespace RabbitCMS\Backend\Support;

class BackendAcl
{
    protected $acl = [];

    /**
     * Add ACL rule
     * @param string|array $acl
     * @param string $caption
     */
    public function addAcl($acl, $caption)
    {
        $acl = is_array($acl) ? $acl : explode('.', $acl);
        $scope = &$this->acl;
        while ($rule = array_shift($acl)) {
            if (!array_key_exists($rule, $scope)) {
                $scope[$rule] = count($acl) ? [] : $caption;
            } elseif (!is_array($scope[$rule])) {
                $scope[$rule] = ['*' => $scope[$rule]];
            }elseif(count($acl) === 0) {
                $scope[$rule]['*'] = $caption;
            }
            $scope = &$scope[$rule];
        }
        //$scope['*'] = $caption;
    }

    public function add(array $acl)
    {
        foreach ($acl as $rule => $caption) {
            $this->addAcl($rule, $caption);
        }
    }

    /**
     * Return ACL rules
     * @return array
     */
    public function getAcl()
    {
        return $this->acl;
    }

    /**
     * Get ACL rules for module or its section.
     *
     * @param      $module
     * @param null $section
     * @return array
     */
    public function getModulePermissions($module, $section = null)
    {
        $permissions = $this->acl[$module];

        $list = ($section !== null) ? array_dot($permissions[$section], $module . '.' . $section . '.')
            : array_dot($permissions, $module . '.');

        $result = [];
        foreach ($list as $key => $value) {
            if (!ends_with($key, '*'))
                $result[] = $key;
        }

        return $result;
    }
}