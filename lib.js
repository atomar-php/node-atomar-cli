'use strict';

var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var store = require('./module_store');

// TODO: set the appropriate path for the os
var modules_dir = '/usr/local/lib/atomar_modules';

/**
 * Checks if the file exists
 * @param file
 * @returns {boolean}
 */
function fileExists(file) {
    try {
        fs.statSync(file);
        return true;
    } catch(err) {
        return false;
    }
}

/**
 * Installs an atomar module
 * @param module_name
 * @param install_path if left null the module will be installed globally
 * @param clone_with_ssh
 */
function install_module(module_name, install_path, clone_with_ssh) {
    var remote;
    var module = store.lookup_module(module_name, '*');
    var global_install = false;

    if(module) {
        if(clone_with_ssh) {
            remote = 'git@github.com:' + module.owner + '/' + module.repo;
        } else {
            remote = 'https://github.com/' + module.owner + '/' + module.repo;
        }
        if(!install_path) {
            global_install = true;
            install_path = path.join(modules_dir, module_name);
        } else {
            install_path = path.join(install_path, module_name);
        }

        var cmd;
        if(fileExists(install_path)) {
            console.log('Updating ' + module_name + '...');
            cmd = 'git pull origin master';
            if(global_install) {
                cmd = 'sudo ' + cmd;
            }
            cmd = 'cd ' + install_path + ' && ' + cmd;
        } else {
            console.log('Installing ' + module_name + '...');
            cmd = 'git clone ' + remote + ' ' + install_path;
            if(global_install) {
                shell.exec('sudo mkdir -p ' + modules_dir);
                cmd = 'sudo ' + cmd;
            }
        }
        shell.exec(cmd);
    } else {
        throw new Error('The module "' + module_name + '" does not exist.');
    }
}

/**
 * Returns the path to a module if it exists in the global path
 * @param name
 * @returns string
 */
function lookup_module(name) {
    var dir = path.join(modules_dir, name);
    try {
        if (fs.statSync(dir).isDirectory()) {
            return dir;
        }
    } catch(err) {}
    return null;
}

module.exports = {
    lookup_module: lookup_module,
    install_module: install_module
};