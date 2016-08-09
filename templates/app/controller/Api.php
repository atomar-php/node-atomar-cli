<?php

namespace app\controller;

use atomic\core\ApiController;

class Api extends ApiController {

    function get_hello_world() {
        return 'getting: Hello, World!';
    }

    function post_hello_world() {
        return 'posting: Hello, World!';
    }
}