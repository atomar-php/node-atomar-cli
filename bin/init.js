'use strict';

const path = require('path');
const fs = require('fs');
const lib = require('../lib');
const mkdirp = require('mkdirp');
const readline = require('readline');

exports.command = 'init';
exports.describe = 'Initializes a new Atomar module.';
exports.builder = {
    d: {
        alias: 'dir',
        description: 'The directory that will be initialized'
    }
};
exports.handler = function(argv) {
    let initDir = argv.dir ? argv.dir : process.cwd();
    return init(initDir).catch(function(err) {
        console.error(err.message);
    });
};
exports.cmd = init;

/**
 * Initializes the atomar.json file
 * @param dir {string} the directory where the atomar.json will be created
 * @returns {Promise.<string>} the path to the atomar.json file
 */
function init(dir) {
    let filepath = path.join(dir, lib.spec.package_file);
    if(lib.fileExists(filepath)) {
        return Promise.reject(new Error(path.resolve(dir) + ' has already been initialized.'));
    }
    let config = {
        name: lib.machineName(path.basename(path.dirname(filepath))),
        version: '1.0.0',
        atomar_version: lib.spec.atomar_version,
        description: ''
    };
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    /**
     *
     * @param message {string} the question being asked
     * @param validator {function} a function to validate the answer
     * @returns {Promise}
     */
    const question = function(message, validator) {
        return new Promise(function(resolve, reject) {
            rl.question(message, function(answer) {
                if(validator && !validator(answer)) {
                    reject();
                } else {
                    resolve(answer);
                }
            });
        });
    };

    console.log('This utility will walk you through creating an ' + lib.spec.package_file + ' file.\n');
    return question('name: (' + config.name + ') ', function(answer) {
            if(answer) {
                let safe_name = lib.machineName(answer);
                if (safe_name !== answer) {
                    console.log('Sorry, name can only contain alphanumeric characters and underscores. And must begin with a letter.');
                    return false;
                }
            }
            return true;
        })
        .then((answer) => {
            if(answer) config.name = answer;
            return question('Version: (' + config.version + ') ');
        })
        .then(function(answer) {
            if(answer) config.version = answer;
            return question('description: ');
        })
        .then(function(answer) {
            if (answer) config.description = answer;
            return question('keywords: ');
        })
        .then(function(answer) {
            if(answer) config.keywords = answer;
            return question('author: ');
        })
        .then(function(answer) {
            if(answer) config.author = answer;
            console.log('\nAbout to write to ' + filepath + ':\n');
            console.log(JSON.stringify(config, null, 2), '\n');
            return question('Is this ok? (yes) ');
        })
        .then(function(answer) {
            if(!answer || answer.toLowerCase() === 'yes') {
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        })
        .then(function() {
            rl.close();

            // write config
            mkdirp.sync(path.dirname(filepath));
            fs.writeFileSync(filepath, JSON.stringify(config, null, 2), 'utf8');

            // copy hooks and install scripts
            let templates = path.join(__dirname, 'init', 'templates');
            let hooksPath = path.join(dir, 'Hooks.php');
            if(!lib.fileExists(hooksPath)) {
                lib.injectTemplate(path.join(templates, 'Hooks.php'), hooksPath, {
                    namespace: config.name,
                });
            }

            return Promise.resolve(filepath);
        })
        .catch(function(err) {
            // cleanup after error
            console.log('Aborted.');
            rl.close();
            throw err;
        });
}