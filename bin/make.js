var shell = require('shelljs');
var path = require('path');

exports.command = 'make <name>';
exports.describe = 'Creates a new atomar site';
exports.builder = {
    d: {
        alias: 'dir',
        default: process.cwd(),
        description: 'The parent directory where the site will be created'
    },
    g: {
        alias: 'git',
        default: true,
        description: 'Initialize the site as a git repository'
    }
};
exports.handler = function(argv) {
    var siteDir = path.join(argv.dir, argv.name.toLowerCase().replace(/\s+/g, '-'));
    console.log('Creating "' + argv.name + '" at ' + siteDir);
    shell.exec('mkdir ' + siteDir + ' && git init ' + siteDir);
    shell.exec('cp templates/AppAPI.php ' + siteDir);
    shell.exec('cp templates/hooks.php ' + siteDir);
    shell.exec('cp templates/install.php ' + siteDir);
    shell.exec('cp templates/package.json ' + siteDir);
    // TODO: update package.json to use the atomar version currently installed

    shell.exec('cd ' + siteDir + ' && git add . && git commit -m "initial commit"');
};