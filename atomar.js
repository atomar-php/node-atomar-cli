#! /usr/bin/env node

let commandDir = './bin';

let argv = require('yargs')
    .commandDir(commandDir)
    .help('help')
    .alias('h', 'help')
    .strict(true)
    .demand(1)
    .argv;