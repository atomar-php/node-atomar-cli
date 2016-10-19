<?php

namespace {{namespace}};

use atomar\core\ApiController;

class {{name}} extends ApiController {

    function get_hello_world() {
        return 'getting: Hello, World! This is the {{name}} api.';
    }

    function post_hello_world() {
        return 'posting: Hello, World! This is the {{name}} api.';
    }

    /**
     * Allows you to perform any additional actions before post requests are processed
     * @param array $matches
     */
    protected function setup_post($matches = array())
    {
        // TODO: Implement setup_post() method.
    }

    /**
     * Allows you to perform any additional actions before get requests are processed
     * @param array $matches
     */
    protected function setup_get($matches = array())
    {
        // TODO: Implement setup_get() method.
    }
}