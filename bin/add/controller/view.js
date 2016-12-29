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
    argv.name = argv.name.replace(/\.php$/i, '');

    let className = tools.className(argv.name);
    let destFile = path.join(process.cwd(), atomar_config.controllers_dir, className + '.php');
    mkdirp.sync(path.dirname(destFile));
    if(tools.fileExists(destFile)) {
        console.error('The path already exists', destFile);
        return;
    }

    let templates = path.join(__dirname, 'templates');
    tools.injectTemplate(path.join(templates, 'view.php'), destFile, {
        namespace: info.name + '\\controller',
        name: className,
        module_id: info.name,
        html_view: className.toLowerCase()
    });
    let viewFile = path.join(process.cwd(), atomar_config.views_dir, className.toLowerCase() + '.html');
    mkdirp.sync(path.dirname(viewFile));
    if(!tools.fileExists(viewFile)) {
        tools.injectTemplate(path.join(templates, 'view.html'), viewFile);
    }


    // TODO: ask to build the route if one does not exist
};