var shell = require('shelljs');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var lib = require('../lib');
var templateDir = path.normalize(path.join(__dirname, '../templates'));

var atomar_path = lib.lookup_module('atomar');

// TODO: make the atomar path optional and default to use the global location
// TODO: make the app path optional and default to use the current directory (but check that it's valid first)

exports.command = 'deploy <deploy_path> <atomar_path>';
exports.describe = 'Deploys an atomar application to run on an atomar instance';
exports.builder = {
    app: {
        alias: 'app_path',
        default: './',
        description: 'The path to the application that will be deployed'
    },
    atomar: {
        alias: 'atomar_path',
        default: atomar_path,
        description: 'The path to the atomar installation.'
    }
};
exports.handler = function(argv) {
    var deploy_path = path.resolve(argv.deploy_path);
    var app_path = path.resolve(argv.app_path);
    var atomar_path = path.resolve(argv.atomar_path);

    // TODO: validate app_path is a valid atomar module

    if(!atomar_path) {
        throw new Error('An installation of atomar could not be found. Please install atomar globally or specify a custom atomar installation path with --atomar_path');
    }

    console.log('Deploying to ' + deploy_path);
    shell.exec('mkdir -p ' + deploy_path);
    fs.writeFileSync(path.join(deploy_path, 'index.php'), '<?php\n\n' +
        'require_once("'+ path.resolve(atomar_path) + '/Atomar.php");\n\n' +
        '\\Atomar\\Atomar::init("config.json");\n' +
        '\\Atomar\\Atomar::run();');
    shell.exec('cp -r ' + templateDir + '/deploy/. ' + deploy_path);
    shell.exec('chmod 644 ' + deploy_path + '/.htaccess');

    // update config
    var configFile = path.join(deploy_path, 'config.json');
    var c = require(configFile);
    c.app_dir = app_path;
    c.cron_token = crypto.randomBytes(20).toString('hex');
    fs.writeFileSync(configFile, JSON.stringify(c, null, 2));
};
