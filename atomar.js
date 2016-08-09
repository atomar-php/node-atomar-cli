#! /usr/bin/env node

var fs = require('fs');
var commandDir = './bin';

fs.readdir(commandDir, function(err, commands) {
    var argv = require('yargs')
        .commandDir('./bin')
        .showHelpOnFail(true, 'Specify --help for available options')
        .help('help')
        .alias('h', 'help')
        .argv;
});