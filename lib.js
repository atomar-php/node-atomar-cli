'use strict';

let shell = require('shelljs');
let path = require('path');
let fs = require('fs');
let store = require('./module_store');
let mkdirp = require('mkdirp');
let semver = require('./semver');

let spec = {
    controllers_dir: 'controller',
    views_dir: 'views',
    package_file: 'atomar.json',
    // TODO: it would be great if we could pull this value from the web and notify users if there is an update
    atomar_version: '0.2.0'
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
    let data = fs.readFileSync(source, 'utf8');
    for(let key of Object.keys(values)) {
        let match = new RegExp('\{\{' + key + '\}\}', 'g');
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
        let data = fs.readFileSync(path.join(process.cwd(), spec.package_file));
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
    let data = fs.readFileSync(filePath, 'utf8');
    data = data.replace(matcher, replacement);
    fs.writeFileSync(filePath, data, 'utf8');
}

/**
 * Installs an atomar module
 * @param module_name
 * @param version
 * @param install_path if left null the module will be installed globally
 * @param clone_with_ssh
 */
function install_module(module_name, version, install_path, clone_with_ssh) {
    let global_install = false;
    let module = store.lookup_module(module_name, version);
    if(module) {
        console.log('Found ' + module.slug + ':' + module.version);

        let remote = clone_with_ssh ? module.clone.ssh : module.clone.http;
        if(!install_path) {
            global_install = true;
            install_path = path.join(modulesDir(), module.slug);
        } else {
            install_path = path.join(install_path, module.slug);
        }

        // install
        if(!fileExists(install_path)) {
            shell.exec('git clone ' + remote + ' ' + install_path);
        }

        // update
        if(fileExists(install_path)) {
            shell.exec('cd ' + install_path + ' && git fetch origin');
        }

        // checkout Version
        if(module.commit) {
            shell.exec('cd ' + install_path + ' && git checkout ' + module.commit);
        }

        console.log(module.slug + ' installed to ' + install_path);

        // record in config
        if(!global_install) {
            let config = {};
            if(fileExists(spec.package_file)) {
                let data = fs.readFileSync(spec.package_file, 'utf8');
                config = JSON.parse(data);
            }
            if(!config.dependencies) config.dependencies = {};
            config.dependencies[module.owner + '/' + module.slug] = module.version;
            fs.writeFileSync(spec.package_file, JSON.stringify(config, null, 2), 'utf8');
        }

        run_composer(install_path);

        // validate module config
        let module_config = path.join(install_path, spec.package_file);
        if(fileExists(module_config)) {
            let data = fs.readFileSync(module_config, 'utf8');
            try {
                let config = JSON.parse(data);
                let compare = semver(config.version, spec.atomar_version);
                if(compare === -1) {
                    console.warn('WARING: This module supports an old version of Atomar');
                } else if(compare === 1) {
                    console.warn('WARING: This module supports a newer version of Atomar');
                }
            } catch (err) {
                console.warn('WARING: This module\'s ' + spec.package_file + ' file appears to be corrupt');
                console.error(err);
            }
        } else {
            console.warn('WARING: This does not appear to be an atomar module');
        }
    } else {
        throw new Error('That version of "' + module_name + '" does not exist.');
    }
}

/**
 * Returns the atomar cli root dir.
 * This is where we store global things.
 * @returns {*}
 */
function rootDir() {
    let home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    let root = path.join(home, '.atomar_cli');
    mkdirp.sync(root);
    return root;
}

/**
 * Returns the path to the global modules directory
 * @returns {*}
 */
function modulesDir() {
    let dir = path.join(rootDir(), 'atomar_modules');
    mkdirp.sync(dir);
    return dir;
}

/**
 * Runs composer in the working dir.
 * If composer is not installed it will be downloaded to the working dir
 *
 * @param working_dir the directory where composer will be executed
 */
function run_composer(working_dir) {
    let cmd;

    if(!fileExists(path.join(working_dir, 'composer.json'))) return;

    // fetch composer
    let composer_installer = path.join(rootDir(), 'composer.php');
    let composer = path.join(rootDir(), 'composer.phar');
    if(!fileExists(composer)) {
        console.log('Getting composer');
        cmd = 'curl -sS https://getcomposer.org/installer -o ' + composer_installer;
        cmd += ' && php ' + composer_installer + ' --install-dir=' + rootDir();
        cmd += ' && rm ' + composer_installer;
        shell.exec(cmd);
    }

    // update
    cmd = composer + ' update -d=' + working_dir;
    shell.exec(cmd);

    // install
    console.log('Installing dependencies');
    cmd = composer + ' install -d=' + working_dir;
    shell.exec(cmd);
}

/**
 * Returns the path to a module if it exists in the global path
 * @param name
 * @returns string
 */
function lookup_module(name) {
    let dir = path.join(modulesDir(), name);
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
    let hasModule = typeof module !== 'function',
        f = hasModule ? module[fn] : module,
        mod = hasModule ? module : null;

    return function () {
        let args = [],
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
    run_composer: run_composer,
    machineName: machineName,
    className: className,
    get spec() { return spec }
};