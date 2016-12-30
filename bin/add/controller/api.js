'use strict';

const path = require('path');
const tools = require('../../../tools');
const util = require('./controller_util');

exports.command = 'api <name>';
exports.describe = 'Create a RESTfull API controller';
exports.builder = {

};
exports.handler = function(argv) {
    let info = util.prepare(argv);

    let templates = path.join(__dirname, 'templates');

    // add controller
    console.log('- Adding controller: ' + info.className);
    tools.injectTemplate(path.join(templates, 'api.php'), info.classFile, {
        namespace: info.classNamespace,
        name: info.className
    });

    // add route
    console.log('- Adding route');
    util.writeRoute(info.routesFile, info.routes);

    console.log('Finished!');
};