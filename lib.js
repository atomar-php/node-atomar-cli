'use strict';

let shell = require('shelljs');
let path = require('path');
let fs = require('fs');
let store = require('./module_store');
let tools = require('./tools');
let atomar_config = require('./config');
let semver = require('./semver');

/**
 * Installs an atomar module
 * @param module_name
 * @param version
 * @param install_path if left null the module will be installed globally
 * @param clone_with_ssh
 */
function install_module(module_name, version, install_path, clone_with_ssh) {
    let global_install = install_path === null;
    if(!global_install) {
        // validate module package exists
        let module_config = atomar_config.loadPackage();
        if(module_config === null) {
            console.error('Not an Atomar module');
            return false;
        }
    }

    let module = store.lookup_module(module_name, version);

    console.log('#####################');
    console.log('# Found ' + module.slug + ':' + module.version);
    console.log('#####################');

    let remote = clone_with_ssh ? module.clone.ssh : module.clone.http;
    if(!install_path) {
        install_path = path.join(atomar_config.modules_dir, module.slug);
    } else {
        install_path = path.join(install_path, module.slug);
    }
    
    // install
    if(!tools.fileExists(install_path)) {
        console.log('\n- Installing ' + module.slug + ' to ' + install_path + '...');
        shell.exec('git clone ' + remote + ' ' + install_path);
    }

    // update
    if(tools.fileExists(install_path)) {
        console.log('\n- Updating ' + module.slug + '...');
        shell.exec('cd ' + install_path + ' && git fetch origin');
    }

    // checkout Version
    if(module.tag) {
        console.log('\n- Checking out ' + module.tag.name + '...');
        shell.exec('cd ' + install_path + ' && git checkout ' + module.tag.name);
    } else {
        console.warn('\n- WARNING: No versions available so tracking master.');
        shell.exec('cd ' + install_path + ' && git checkout master');
    }

    // record in config
    if(!global_install) {
        let module_config = atomar_config.loadPackage();
        if(!module_config.dependencies) module_config.dependencies = {};
        module_config.dependencies[module.owner + '/' + module.slug] = module.version;
        fs.writeFileSync(atomar_config.package_file, JSON.stringify(module_config, null, 2), 'utf8');
    }

    run_composer(install_path);

    // validate module config
    let sub_module_config = path.join(install_path, atomar_config.package_file);
    if(tools.fileExists(sub_module_config)) {
        let data = fs.readFileSync(sub_module_config, 'utf8');
        try {
            let config = JSON.parse(data);
            if(typeof config.atomar_version !== 'undefined') {
                let compare = semver(config.atomar_version, atomar_config.atomar_version);
                if (compare === -1) {
                    console.warn('- WARING: ' + module.slug + ' supports an older version of Atomar.');
                } else if (compare === 1) {
                    console.warn('- WARING: ' + module.slug + ' supports a newer version of Atomar.');
                }
            } else {
                console.warn('\n- WARNING: ' + module.slug + ' is missing the "atomar_version" in it\'s ' + atomar_config.package_file + ' file.');
            }
        } catch (err) {
            console.warn('\n- WARING: ' + module.slug + ' has a corrupt ' + atomar_config.package_file + ' file.');
            console.error(err);
        }
    } else {
        console.warn('\n- WARING: This does not appear to be an atomar module.');
    }

    console.log('\n- Finished installing ' + module.slug + '.\n');
    return true;
}

/**
 * Checks if a composer config file exists in the given directory
 * @param working_dir the directory where the composer config file may exist
 * @return boolean 
 */
function has_composer(working_dir) {
    return tools.fileExists(path.join(working_dir, 'composer.json'));
}

/**
 * Runs composer in the working dir.
 * If composer is not installed it will be downloaded to the working dir
 *
 * @param working_dir the directory where composer will be executed
 */
function run_composer(working_dir) {
    let cmd;

    if(!has_composer(working_dir)) return;

    // fetch composer
    let composer_installer = path.join(atomar_config.cache_dir, 'composer.php');
    let composer = path.join(atomar_config.cache_dir, 'composer.phar');
    if(!tools.fileExists(composer)) {
        console.log('\n- Installing composer...');
        cmd = 'curl -sS https://getcomposer.org/installer -o ' + composer_installer;
        cmd += ' && php ' + composer_installer + ' --install-dir=' + atomar_config.cache_dir;
        cmd += ' && rm ' + composer_installer;
        shell.exec(cmd);
    }

    // install
    console.log('\n- Composer: Installing...');
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
    // TODO: this is deprecated
    loadPackage: atomar_config.loadPackage,
    lookup_module: lookup_module,
    install_module: install_module,
    run_composer: run_composer,
    has_composer: run_composer,
    config: atomar_config
};