'use strict';

let fs = require('fs');
let path = require('path');

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

function homeDir() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
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
    replaceInFile: replaceInFile,
    homeDir: homeDir,
    fileExists: fileExists,
    machineName: machineName,
    className: className,
    promisify: promisify,
    injectTemplate: injectTemplate
};