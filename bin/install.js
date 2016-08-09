var shell = require('shelljs');
var fs = require('fs');

exports.command = 'install <path>';
exports.describe = 'Installs an instance of atomar to the path';
exports.builder = {
    ssh: {
        default: false,
        description: 'clone via ssh'
    }
};
exports.handler = function(argv) {
    try {
        if (fs.statSync(argv.path).isDirectory()) {
            console.error('The directory already exists at ' + argv.path);
            console.error('Aborting...');
            return;
        }
    } catch(err) {}

    console.log('Cloning atomar to ' + argv.path);
    // TODO: make sure parent directories exist
    if(argv.ssh) {
        shell.exec('git clone git@github.com:neutrinog/atomar.git ' + argv.path);
    } else {
        shell.exec('git clone https://github.com/neutrinog/atomar.git ' + argv.path);
    }
};