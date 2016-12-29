/**
 * This module defines the default configuration and
 * loads custom settings if available
 *
 */

'use strict';

let path = require('path');
let fs = require('fs');
let tools = require('./tools');
let mkdirp = require('mkdirp');

let cacheDir = path.join(tools.homeDir(), '.atomar');
let modulesDir = path.join(cacheDir, 'atomar_modules');
// TODO: it would be great if we could pull this value from the web and notify users if there is an update
let atomarVersion = '0.2.0';

let settings = {
    controllers_dir: 'controller',
    views_dir: 'views',
    package_file: 'atomar.json',
    atomar_version: atomarVersion,
    cache_dir: cacheDir,
    modules_dir: modulesDir,

    // configurable
    use_ssh: false,
    repo_owner: 'atomar-php',
    repo_prefix: 'atomar-'
};

// load config
let config_path = path.join(settings.cache_dir, 'config.json');
if(tools.fileExists(config_path)) {
    let data = fs.readFileSync(config_path, 'utf8');
    try {
        let config = JSON.parse(data);
        if(typeof config.repo_owner !== 'undefined') settings.repo_owner = config.repo_owner;
        if(typeof config.use_ssh !== 'undefined') settings.use_ssh = !!config.use_ssh;
        if(typeof config.repo_prefix !== 'undefined') settings.repo_prefix = config.repo_prefix;
    } catch (err) {
        console.warn('Could not load config');
        console.error(err.message);
    }
}

/**
 * Loads the package in the current dir
 *
 * @returns {{}|null} null if the package does not exist
 */
settings.loadPackage = function loadPackage() {
    let data = null;
    try {
        data = fs.readFileSync(path.join(process.cwd(), settings.package_file));
    } catch (err) {}
    if(data != null) {
        try {
            data = JSON.parse(data);
        } catch (err) {
            console.error(err);
        }
    }
    return data;
};

// create directories
mkdirp.sync(settings.modules_dir);
mkdirp.sync(settings.cache_dir);

module.exports = settings;