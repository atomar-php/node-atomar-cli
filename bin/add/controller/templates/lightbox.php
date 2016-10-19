<?php

namespace {{namespace}};

use atomar\core\Lightbox;

class {{name}} extends Lightbox {

    function GET($matches = array()) {
        echo $this->renderView('{{module_id}}/views/lightbox.{{html_view}}.html', array(
            'greeting' => 'Hello, World! This is the {{module_id}} lightbox.'
        ));
    }

    function POST($matches = array()) {
        self::GET($matches);
    }

    function RETURNED() {

    }
}
