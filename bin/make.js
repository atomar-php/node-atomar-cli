var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var lib = require('../lib');
var rimraf = require('rimraf');
var templateDir = path.normalize(path.join(__dirname, '../templates'));


exports.command = 'make <name>';
exports.describe = 'Creates a new atomar package that can be used as a site or module';
exports.builder = {
    d: {
        alias: 'dir',
        description: 'The directory where the site will be created'
    },
    m: {
        alias: 'desc',
        default: '',
        description: 'Provides a description of the package'
    },
    g: {
        alias: 'git',
        default: true,
        description: 'Initialize the package as a git repository'
    },
    t: {
        alias: 'type',
        default: 'site',
        description: 'Optimizes the package for use as a site or module.',
        choices: ['site', 'module']
    },
    f: {
        alias: 'force',
        default: false,
        description: 'Will overwrite any existing files'
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
        if (fs.statSync(siteDir).isDirectory() && !argv.force) {
            console.error('The directory already exists at ' + siteDir);
            console.error('Aborting...');
            return;
        } else {
            rimraf.sync(siteDir);
        }
    } catch(err) {}

    console.log('Creating "' + argv.name + '" at ' + siteDir);
    shell.exec('mkdir -p ' + siteDir);
    shell.exec('cp -r ' + templateDir + '/package/* ' + siteDir);

    // update package
    var packageFile = path.join(siteDir, 'package.json');
    var p = require(packageFile);
    p.name = argv.name;
    p.description = argv.desc;
    p.atomarVersion = require('../package.json').atomarVersion;
    // TODO: add dependencies. maybe in another command
    fs.writeFileSync(packageFile, JSON.stringify(p, null, 2));

    // format package as module
    // TODO: we need to use placeholders and inject the correct info rather than parsing through everything after the fact
    if(argv.type === 'module') {
        console.log('formatting as module...');
        var files = [
            'install.php',
            'hooks.php',
            'controller/Api.php'
        ];
        files.map(function(f) {
            lib.replaceInFile(path.join(siteDir, f), 'namespace app', 'namespace ' + argv.name);
        });
        rimraf.sync(path.join(siteDir, 'controller/Index.php'));
        rimraf.sync(path.join(siteDir, 'views'));
        lib.replaceInFile(path.join(siteDir, 'hooks.php'), /\,\n.*app\\controller\\Index.*/g, '');
    }

    // initialize git
    if(argv.git) {
        console.log('Initializing git repo...');
        shell.exec('cd ' + siteDir + ' && git init && git add . && git commit -m "initial commit"');
    }
};