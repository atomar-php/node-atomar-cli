'use strict';

var path = require('path');
var lib = require('../../../lib');
var mkdirp = require('mkdirp');
var fs = require('fs');

exports.command = 'view <name>';
exports.describe = 'Create a view controller';
exports.builder = {

};
exports.handler = function(argv) {
    var className = argv.name.replace(/[^a-zA-Z0-9]+/g, '');
    var destFile = path.join(process.cwd(), lib.spec.controllers_dir, className + '.php');
    mkdirp.sync(path.dirname(destFile));
    if(lib.fileExists(destFile)) {
        console.error('The path already exists', destFile);
        return;
    }

    var info = lib.loadPackage();
    if(!info) throw new Error('Not an atomar module. Try running inside a module/site.');


    var templates = path.join(__dirname, 'templates');
    lib.injectTemplate(path.join(templates, 'view.php'), destFile, {
        namespace: info.site ? 'app\\controller' : info.name + '\\controller',
        name: className,
        module_id: info.name,
        html_view: className.toLowerCase()
    });
    var viewFile = path.join(process.cwd(), lib.spec.views_dir, className.toLowerCase() + '.html');
    mkdirp.sync(path.dirname(viewFile));
    if(!lib.fileExists(viewFile)) {
        lib.injectTemplate(path.join(templates, 'view.html'), viewFile);
    }


    // TODO: ask to build the route if one does not exist
};