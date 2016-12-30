<?php

namespace {{namespace}};
use atomar\core\HookReceiver;

/**
 * Receives hook events from Atomar on behalf of the module
 */
class Hooks extends HookReceiver
{
    /**
     * Returns an array of routes mapped to controllers
     *
     * @param $module the instance of this module
     * @return array the array of routes
     */
    function hookRoute($module)
    {
        $urls = $this->loadRoute($module, 'public');

        // perform custom logic to determine available routes if necessary.

        return $urls;
    }
}