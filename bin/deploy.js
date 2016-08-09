var shell = require('shelljs');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

exports.command = 'deploy <deploy_path> <app_path> <atomar_path>';
exports.describe = 'Deploys an atomar application to run on an atomar instance';
exports.builder = {
};
exports.handler = function(argv) {
    var deploy_path = path.resolve(argv.deploy_path);
    var app_path = path.resolve(argv.app_path);
    var atomar_path = path.resolve(argv.atomar_path);
    try {
        if (fs.statSync(deploy_path).isDirectory()) {
            console.error('The directory already exists at ' + deploy_path);
            console.error('Aborting...');
            return;
        }
    } catch(err) {}

    console.log('Deploying to ' + deploy_path);
    shell.exec('mkdir -p ' + deploy_path);
    fs.writeFileSync(path.join(deploy_path, 'index.php'), '<?php\n\n' +
        'require_once("'+ path.resolve(atomar_path) + '");\n\n' +
        '\\Atomar\\Atomar::init("config.json");\n' +
        '\\Atomar\\Atomar::run();');
    shell.exec('cp -r templates/deploy/. ' + deploy_path);
    shell.exec('chmod 644 ' + deploy_path + '/.htaccess');

    // update config
    var configFile = path.join(deploy_path, 'config.json');
    var c = require(configFile);
    c.app_dir = app_path;
    c.cron_token = crypto.randomBytes(20).toString('hex');
    fs.writeFileSync(configFile, JSON.stringify(c, null, 2));
};