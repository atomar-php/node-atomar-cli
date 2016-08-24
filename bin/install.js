var fs = require('fs');
var lib = require('../lib');

exports.command = 'install <name>';
exports.describe = 'Installs an atomar module';
exports.builder = {
    global: {
        alias: 'g',
        description: 'Install the module globally',
        default: false
    },
    ssh: {
        default: true,
        description: 'clone via ssh'
    }
};
exports.handler = function(argv) {
    lib.install_module(argv.name, argv.g ? null : 'atomar_modules', argv.ssh);
};