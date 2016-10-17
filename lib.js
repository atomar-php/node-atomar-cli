'use strict';

var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var store = require('./module_store');
var mkdirp = require('mkdirp');

// TODO: set the appropriate path for the os
var modules_dir = '/usr/local/lib/atomar_modules';

var spec = {
    controllers_dir: 'controllers',
    views_dir: 'views',
    package_file: 'atomar.json'
};

/**
 * Converts a string into a class name
 * @param string
 */
function className(string) {
    return string.replace(/[^a-zA-Z0-9]+/g, '');
}

/**
 * Converts a string to a machine safe name
 * @param string
 */
function machineName(string) {
    return string.replace(/[^a-zA-Z0-9]+/g, '_').replace(/(^_|_$)/g, '').replace(/^[0-9]+]/g, '').toLowerCase();
}

/**
 * Injects a template
 * @param source {string}
 * @param destination {string}
 * @param values {{}} a map of values to be replaced in the template
 */
function injectTemplate(source, destination, values) {
    values = values || {};
    var data = fs.readFileSync(source, 'utf8');
    for(var key of Object.keys(values)) {
        var match = new RegExp('\{\{' + key + '\}\}', 'g');
        data = data.replace(match, values[key]);
    }
    mkdirp(path.dirname(destination));
    if(fileExists(destination)) throw new Error('The path already exists', destination);
    fs.writeFileSync(destination, data, 'utf8');
}

/**
 * Loads the package in the current dir
 *
 * @returns {{}|null} null if the package does not exist
 */
function loadPackage() {
    try {
        var data = fs.readFileSync(path.join(process.cwd(), spec.package_file));
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
    return null;
}

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
 * Replaces a matched string in a file
 * @param filePath
 * @param matcher regex
 * @param replacement string
 */
function replaceInFile(filePath, matcher, replacement) {
    var data = fs.readFileSync(filePath, 'utf8');
    data = data.replace(matcher, replacement);
    fs.writeFileSync(filePath, data, 'utf8');
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
        console.log('Cloning ' + remote + ' into ' + install_path);
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


/**
 * Turns a standard callback method into a promise-style method.
 *  Assumes standard node.js style:
 *      someFunction(arg1, arg2, function(err, data) { ... })
 *
 *  This will pass the proper number of arguments and convert
 *      the callback structure to a Promise.
 *
 * e.g. var readdir = promisify(fs, 'readdir'),
 *          readdir('something').then(someFunction);
 *
 *      var rm = promisify(rimraf),
 *          rm('something').then(someFunction);
 *
 * @param module
 * @param fn
 * @returns {function.<Promise>} a new function that returns a promise
 */
function promisify(module, fn) {
    var hasModule = typeof module !== 'function',
        f = hasModule ? module[fn] : module,
        mod = hasModule ? module : null;

    return function () {
        var args = [],
            i = arguments.length - 1;

        /**
         *  Don't pass an arguments list that has undefined values at the end.
         *      This is so the callback for function gets passed in the right slot.
         *
         *      If the function gets passed:
         *          f(arg1, arg2, undefined, cb)
         *
         *      ...it will think it got an undefined cb.
         *
         *      We instead want it to get passed:
         *          f(arg1, arg2, cb)
         *
         *      Before:    [arg1, null, undefined, arg2, undefined, undefined]
         *      After:     [arg1, null, undefined, arg2]
         */
        while (i >= 0 && typeof arguments[i] === 'undefined') {
            --i;
        }
        while (i >= 0) {
            args.unshift(arguments[i]);
            --i;
        }

        return new Promise(function (resolve, reject) {
            try {
                resolve(f.apply(mod, args));
            } catch (err) {
                reject(err);
            }
        });
    };
}

module.exports = {
    injectTemplate: injectTemplate,
    loadPackage: loadPackage,
    lookup_module: lookup_module,
    install_module: install_module,
    replaceInFile: replaceInFile,
    fileExists: fileExists,
    promisify: promisify,
    machineName: machineName,
    className: className,
    get spec() { return spec }
};