'use strict';

let shell = require('shelljs');
let path = require('path');
let fs = require('fs');
let store = require('./module_store');
let mkdirp = require('mkdirp');
let tools = require('./tools');
let atomar_config = require('./config');
let semver = require('./semver');

/**
 * Loads the package in the current dir
 *
 * @returns {{}|null} null if the package does not exist
 */
function loadPackage() {
    try {
        let data = fs.readFileSync(path.join(process.cwd(), atomar_config.package_file));
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
    return null;
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

    console.log('Found ' + module.slug + ':' + module.version);

    let remote = clone_with_ssh ? module.clone.ssh : module.clone.http;
    if(!install_path) {
        global_install = true;
        install_path = path.join(atomar_config.modules_dir, module.slug);
    } else {
        install_path = path.join(install_path, module.slug);
    }

    // install
    if(!tools.fileExists(install_path)) {
        shell.exec('git clone ' + remote + ' ' + install_path);
    }

    // update
    if(tools.fileExists(install_path)) {
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
        if(tools.fileExists(atomar_config.package_file)) {
            let data = fs.readFileSync(atomar_config.package_file, 'utf8');
            config = JSON.parse(data);
        }
        if(!config.dependencies) config.dependencies = {};
        config.dependencies[module.owner + '/' + module.slug] = module.version;
        fs.writeFileSync(atomar_config.package_file, JSON.stringify(config, null, 2), 'utf8');
    }

    run_composer(install_path);

    // validate module config
    let module_config = path.join(install_path, atomar_config.package_file);
    if(tools.fileExists(module_config)) {
        let data = fs.readFileSync(module_config, 'utf8');
        try {
            let config = JSON.parse(data);
            let compare = semver(config.version, atomar_config.atomar_version);
            if(compare === -1) {
                console.warn('WARING: This module supports an old version of Atomar');
            } else if(compare === 1) {
                console.warn('WARING: This module supports a newer version of Atomar');
            }
        } catch (err) {
            console.warn('WARING: This module\'s ' + atomar_config.package_file + ' file appears to be corrupt');
            console.error(err);
        }
    } else {
        console.warn('WARING: This does not appear to be an atomar module');
    }
}

/**
 * Runs composer in the working dir.
 * If composer is not installed it will be downloaded to the working dir
 *
 * @param working_dir the directory where composer will be executed
 */
function run_composer(working_dir) {
    let cmd;

    if(!tools.fileExists(path.join(working_dir, 'composer.json'))) return;

    // fetch composer
    let composer_installer = path.join(atomar_config.cache_dir, 'composer.php');
    let composer = path.join(atomar_config.cache_dir, 'composer.phar');
    if(!tools.fileExists(composer)) {
        console.log('Getting composer');
        cmd = 'curl -sS https://getcomposer.org/installer -o ' + composer_installer;
        cmd += ' && php ' + composer_installer + ' --install-dir=' + atomar_config.cache_dir;
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
    let dir = path.join(atomar_config.modules_dir, name);
    try {
        if (fs.statSync(dir).isDirectory()) {
            return dir;
        }
    } catch(err) {}
    return null;
}

module.exports = {
    loadPackage: loadPackage,
    lookup_module: lookup_module,
    install_module: install_module,
    run_composer: run_composer,
    config: atomar_config
};