#! /usr/bin/env node

var fs = require('fs');
var commandDir = './bin';

fs.readdir(commandDir, function(err, commands) {
    var argv = require('yargs')
        .commandDir('./bin')
        .help('help')
        .alias('h', 'help')
        .strict(true)
        .demand(1)
        .argv;
});