'use strict';

const path = require('path');
const tools = require('../../../tools');
const util = require('./controller_util');

exports.command = 'lightbox <name>';
exports.describe = 'Creates a lightbox controller';
exports.builder = {
    r: {
        alias: 'route',
        description: 'Automatically generates a route for the lightbox',
        default: false
    }
};
exports.handler = function(argv) {
    let info = util.prepare(argv, {
        view_prefix: 'lightbox.'
    });

    let templates = path.join(__dirname, 'templates');

    // add controller
    console.log('- Adding controller: ' + info.className);
    tools.injectTemplate(path.join(templates, 'lightbox.php'), info.classFile, {
        namespace: info.classNamespace,
        name: info.className,
        module_id: info.module_info.name,
        html_view: path.join(info.viewDir, 'lightbox.' + info.className.toLowerCase())
    });

    // add view
    console.log('- Adding view: ' + info.className.toLowerCase());
    if(!tools.fileExists(info.viewFile)) {
        tools.injectTemplate(path.join(templates, 'lightbox.html'), info.viewFile);
    }

    // add route
    if(argv.r) {
        console.log('- Adding route');
        util.writeRoute(info.routesFile, info.routes);
    }

    console.log('Finished!');
};