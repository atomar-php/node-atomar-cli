const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const lib = require('../lib');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const tools = require('../tools');
const atomar_config = require('../config');
const atomar_path = lib.lookup_module('atomar');

exports.command = 'deploy <deploy_path>';
exports.describe = 'Deploys an atomar application to run on an atomar instance';
exports.builder = {
    f: {
        alias: 'force',
        default: false,
        description: 'Overwrite an existing deployment'
    },
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
    let deploy_path = path.resolve(argv.deploy_path);
    let app_path = path.resolve(argv.app_path);
    let atomar_path = path.resolve(argv.atomar_path);

    let info = atomar_config.loadPackage();
    if(!info) throw new Error('Not an atomar module. Try running inside a module or use --app.');

    // validate atomar installation
    if(!atomar_path) {
        throw new Error('An installation of atomar could not be found. Please install atomar globally or specify a custom atomar installation path with --atomar_path');
    }

    let configPath = path.join(deploy_path, 'config.json');
    let htaccessPath = path.join(deploy_path, '.htaccess');
    let indexPath = path.join(deploy_path, 'index.php');

    // clean up existing deployment
    if(argv.force) {
        rimraf.sync(configPath);
        rimraf.sync(htaccessPath);
        rimraf.sync(indexPath);
    }

    if(tools.fileExists(configPath)) {
        throw new Error('A deployment already exists at ' + deploy_path + '. Use -f to overwrite');
    }

    console.log('Deploying "' + info.name + '" to ' + deploy_path);
    let templates = path.join(__dirname, 'deploy', 'templates');
    mkdirp(deploy_path);
    tools.injectTemplate(path.join(templates, 'index.php'), indexPath, {
        atomar_path: path.resolve(path.join(atomar_path, 'Atomar.php'))
    });
    tools.injectTemplate(path.join(templates, 'config.json'), configPath, {
        namespace: info.name,
        cron_token: crypto.randomBytes(20).toString('hex'),
        app_dir: app_path,

    });
    tools.injectTemplate(path.join(templates, '.htaccess'), htaccessPath);
    shell.exec('chmod 644 ' + htaccessPath);
};
