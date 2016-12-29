'use strict';

const path = require('path');
const lib = require('../../../lib');
const mkdirp = require('mkdirp');
const tools = require('../../../tools');
const atomar_config = require('../../../config');
const fs = require('fs');

exports.command = 'api <name>';
exports.describe = 'Create a RESTfull API controller';
exports.builder = {

};
exports.handler = function(argv) {
    let className = tools.className(argv.name);
    let destFile = path.join(process.cwd(), atomar_config.controllers_dir, className + '.php');
    mkdirp.sync(path.dirname(destFile));
    if(tools.fileExists(destFile)) {
        console.error('The path already exists', destFile);
        return;
    }

    let info = atomar_config.loadPackage();
    if(!info) throw new Error('Not an atomar module. Try running inside a module.');


    let templates = path.join(__dirname, 'templates');
    tools.injectTemplate(path.join(templates, 'api.php'), destFile, {
        namespace: info.name + '\\controller',
        name: className
    });

    // TODO: ask to build the route if one does not exist
};