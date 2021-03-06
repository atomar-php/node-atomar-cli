<?php

namespace {{namespace}};

use atomar\core\Controller;

class {{name}} extends Controller {

    function GET($matches = array()) {
        echo $this->renderView('@{{module_id}}/{{html_view}}.html', array(
            'greeting' => 'Hello, World! This is the {{name}} view.'
        ));
    }

    function POST($matches = array()) {
        // routes posts on this page back to get.
        self::GET($matches);
    }
}