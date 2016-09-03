'use strict';

const path = require('path');
const fs = require('fs');
const lib = require('../lib');
const mkdirp = require('mkdirp');
const readline = require('readline');

exports.command = 'init';
exports.describe = 'Creates a an ' + lib.spec.package_file + ' config file in the directory';
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
        name: path.basename(path.dirname(filepath)),
        version: '1.0.0',
        site: true,
        description: ''
    };
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const question = function(question) {
        return new Promise(function(resolve, reject) {
            rl.question(question, function(answer) {
                resolve(answer);
            });
        });
    };

    return question('name: (' + config.name + ') ')
        .then((answer) => {
            if(answer) config.name = answer;
            return question('version: (' + config.version + ') ');
        })
        .then(function(answer) {
            if(answer) config.version = answer;
            return question('description: ');
        })
        .then(function(answer) {
            if (answer) config.description = answer;
            return question('site: (' + config.site + ') ');
        })
        .then(function(answer) {
            if(answer) config.site = answer.toLowerCase() === 'true';
            return Promise.resolve();
        })
        .then(function() {
            rl.close();

            // write config
            config.id = config.name.replace(/[^a-zA-Z]+/g, '_').replace(/(^_|_$)/g, '').toLowerCase();
            mkdirp(path.dirname(filepath));
            fs.writeFileSync(filepath, JSON.stringify(config, null, 2));
            return Promise.resolve(filepath);
        })
        .catch(function(err) {
            // cleanup after error
            rl.close();
            throw err;
        });
}