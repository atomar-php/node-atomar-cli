var shell = require('shelljs');
var path = require('path');
var fs = require('fs');

exports.command = 'make <name>';
exports.describe = 'Creates a new atomar site';
exports.builder = {
    dir: {
        description: 'The directory where the site will be created'
    },
    d: {
        alias: 'desc',
        default: '',
        description: 'Provides a description of the site'
    },
    g: {
        alias: 'git',
        default: true,
        description: 'Initialize the site as a git repository'
    }
};
exports.handler = function(argv) {
    var siteDir;
    if(argv.dir) {
        siteDir = path.resolve(argv.dir);
    } else {
        siteDir = path.resolve(argv.name.toLowerCase().replace(/\s+/g, '-'));
    }


    try {
        if (fs.statSync(siteDir).isDirectory()) {
            console.error('The directory already exists at ' + siteDir);
            console.error('Aborting...');
            return;
        }
    } catch(err) {}

    console.log('Creating "' + argv.name + '" at ' + siteDir);
    shell.exec('mkdir -p' + siteDir);
    shell.exec('cp -r templates/app/* ' + siteDir);

    // update package
    var packageFile = path.join(siteDir, 'package.json');
    var p = require(packageFile);
    p.name = argv.name;
    p.description = argv.desc;
    p.atomarVersion = require('../package.json').atomarVersion;
    // TODO: add dependencies. maybe in another command
    fs.writeFileSync(packageFile, JSON.stringify(p, null, 2));

    // initialize git
    if(argv.git) {
        shell.exec('cd ' + siteDir + ' && git init && git add . && git commit -m "initial commit"');
    }
};