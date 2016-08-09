<?php

namespace app\controller;

use atomar\core\Controller;
use atomar\core\Templator;

class Index extends Controller {

    function GET($matches = array()) {
        echo $this->renderView('app/views/index.html', array(
            'greeting' => 'Hello, World!'
        ));
    }

    function POST($matches = array()) {
        // routes posts on this page back to get.
        self::GET();
    }
}