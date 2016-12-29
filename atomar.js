#! /usr/bin/env node

let shelljs = require('shelljs');

let info = require('./package');
console.log('Atomar CLI v' + info.version);

if(!shelljs.which('git')) {
    console.error('Sorry, this script requires git');
    return;
}

let commandDir = './bin';

let argv = require('yargs')
    .commandDir(commandDir)
    .help('help')
    .alias('h', 'help')
    .strict(true)
    .demand(1)
    .argv;