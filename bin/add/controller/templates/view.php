<?php

namespace {{namespace}};

use atomar\core\Controller;
use atomar\core\Templator;

class {{name}} extends Controller {

    function GET($matches = array()) {
        echo $this->renderView('{{module_id}}/views/{{html_view}}.html', array(
            'greeting' => 'Hello, World!'
        ));
    }

    function POST($matches = array()) {
        // routes posts on this page back to get.
        self::GET();
    }
}