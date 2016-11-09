var fs = require('fs');
var lib = require('../lib');

exports.command = 'install [module]';
exports.describe = 'Installs an atomar module or installs all the dependencies found an atomar.json file';
exports.builder = {
    global: {
        alias: 'g',
        description: 'Install the module globally',
        default: false
    },
    ssh: {
        default: false,
        description: 'clone via ssh'
    }
};
exports.handler = function(argv) {
    if(argv.module) {
        lib.install_module(argv.module, argv.g ? null : 'atomar_modules', argv.ssh);
    } else {
        // install dependencies
        if(lib.fileExists('atomar.json')) {
            var data = fs.readFileSync('atomar.json', 'utf8');
            var dependencies = JSON.parse(data).dependencies;
            if(dependencies) {
                for(var module in dependencies) {
                    lib.install_module(module, 'atomar_modules', argv.ssh);
                }
            }
        }
    }
};