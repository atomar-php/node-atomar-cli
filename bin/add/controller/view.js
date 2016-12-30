'use strict';

const path = require('path');
const tools = require('../../../tools');
const atomar_config = require('../../../config');
const mkdirp = require('mkdirp');
const fs = require('fs');

exports.command = 'view <name>';
exports.describe = 'Create a view controller';
exports.builder = {

};
exports.handler = function(argv) {
    let info = atomar_config.loadPackage();
    if(!info) throw new Error('Not an Atomar module. Try running inside a module.');
    let name = argv.name.replace(/\.php$/i, '').replace(/^\/+/, '');
    let relativePath = '';

    // extract path
    if(name.indexOf('/')) {
        relativePath = path.dirname(name);
        name = path.basename(name);
    }

    // prepare paths
    let templates = path.join(__dirname, 'templates');
    let className = tools.className(name);
    let classDir = atomar_config.controllers_dir;
    let viewDir = atomar_config.views_dir;
    if(relativePath !== '') {
        classDir = path.join(classDir, relativePath);
        viewDir = path.join(viewDir, relativePath);
    }
    let classFile = path.join(process.cwd(), classDir,  className + '.php');
    let viewFile = path.join(process.cwd(), viewDir, className.toLowerCase() + '.html');

    // skip duplicates
    if(tools.fileExists(classFile)) {
        console.error('The path already exists', classFile);
        return;
    }

    mkdirp.sync(path.dirname(viewFile));
    mkdirp.sync(path.dirname(classFile));

    // add controller
    tools.injectTemplate(path.join(templates, 'view.php'), classFile, {
        namespace: info.name + '\\' + classDir.replace(/\//, '\\'),
        name: className,
        module_id: info.name,
        html_view: path.join(viewDir, className.toLowerCase())
    });

    // add view
    if(!tools.fileExists(viewFile)) {
        tools.injectTemplate(path.join(templates, 'view.html'), viewFile);
    }

    // add route
    //  TODO: check if adding routes is disabled

};