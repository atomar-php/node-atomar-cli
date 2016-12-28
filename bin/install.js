let fs = require('fs');
let lib = require('../lib');

exports.command = 'install [module]';
exports.describe = 'Installs an atomar module or installs all the dependencies found an atomar.json file';
exports.builder = {
    global: {
        alias: 'g',
        description: 'Install the module globally',
        default: false
    },
    version: {
        alias: 'v',
        description: 'The version to be installed',
        default: '*'
    },
    ssh: {
        default: false,
        description: 'clone via ssh'
    }
};
exports.handler = function(argv) {
    if(argv.module) {
        lib.install_module(argv.module, argv.v, argv.g ? null : 'atomar_modules', argv.ssh);
    } else {
        // install dependencies
        if(lib.fileExists('atomar.json')) {
            let data = fs.readFileSync('atomar.json', 'utf8');
            let dependencies = JSON.parse(data).dependencies;
            if(dependencies) {
                for(let module in dependencies) {
                    if(dependencies.hasOwnProperty(module)) {
                        lib.install_module(module, dependencies[module], 'atomar_modules', argv.ssh);
                    }
                }
            }
        }
        // run composer on module
        lib.run_composer('./');
    }
};