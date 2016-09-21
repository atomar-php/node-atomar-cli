'use strict';

var path = require('path');
var lib = require('../../../lib');
var mkdirp = require('mkdirp');
var fs = require('fs');

exports.command = 'api <name>';
exports.describe = 'Create a RESTfull API controller';
exports.builder = {

};
exports.handler = function(argv) {
    var className = lib.className(argv.name);
    var destFile = path.join(process.cwd(), lib.spec.controllers_dir, className + '.php');
    mkdirp.sync(path.dirname(destFile));
    if(lib.fileExists(destFile)) {
        console.error('The path already exists', destFile);
        return;
    }

    var info = lib.loadPackage();
    if(!info) throw new Error('Not an atomar module. Try running inside a module.');


    var templates = path.join(__dirname, 'templates');
    lib.injectTemplate(path.join(templates, 'api.php'), destFile, {
        namespace: info.name + '\\controller',
        name: className
    });

    // TODO: ask to build the route if one does not exist
};