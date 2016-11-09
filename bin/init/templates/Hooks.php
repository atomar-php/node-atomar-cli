<?php

namespace {{namespace}};
use atomar\core\HookReceiver;

class Hooks extends HookReceiver
{
    // There are a number of hooks available. here is an example.
    function hookRoute()
    {
        return array(
           // '/api/(?P<api>[a-zA-Z\_-]+)/?(\?.*)?' => '{{namespace}}\controller\Api',
           // '/(\?.*)?' => '{{namespace}}\controller\Index'
       );
    }
}