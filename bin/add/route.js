'use strict';
const atomar_config = require('../../config');

exports.command = 'route <url> <controller>';
exports.describe = 'Inserts a route specification';
exports.builder = {

};
exports.handler = function(argv) {
    let info = atomar_config.loadPackage();
    if(!info) throw new Error('Not an atomar module. Try running inside a module.');

    // TODO: build the route
    // ask to add controller if one does not exist
};