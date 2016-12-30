'use strict';

const path = require('path');
const lib = require('../../../lib');
const mkdirp = require('mkdirp');
const tools = require('../../../tools');
const atomar_config = require('../../../config');
const fs = require('fs');

exports.command = 'api <name>';
exports.describe = 'Create a RESTfull API controller';
exports.builder = {

};
exports.handler = function(argv) {
    let info = atomar_config.loadPackage();
    if(!info) throw new Error('Not an Aomar module. Try running inside a module.');
    let name = argv.name.replace(/\.php$/i, '').replace(/^\/+/, '');
    let relativePath = '';

    // extract path
    if(name.indexOf('/') !== -1) {
        relativePath = path.dirname(name);
        name = path.basename(name);
        console.log('\n- Extracting path: ' + relativePath);
    }

    // prepare paths
    let templates = path.join(__dirname, 'templates');
    let className = tools.className(name);
    let classDir = atomar_config.controllers_dir;
    if(relativePath !== '') {
        classDir = path.join(classDir, relativePath);
    }
    let classFile = path.join(process.cwd(), classDir,  className + '.php');
    let classNamespace = info.name + '\\' + classDir.replace(/\/+/g, '\\');
    let routesFile = path.join(process.cwd(), atomar_config.routes_dir, 'public.json');

    // skip duplicates
    if(tools.fileExists(classFile)) {
        console.error('The path already exists', classFile);
        return;
    }

    mkdirp.sync(path.dirname(classFile));
    mkdirp.sync(path.dirname(routesFile));

    // add controller
    console.log('- Adding controller: ' + className);
    tools.injectTemplate(path.join(templates, 'api.php'), classFile, {
        namespace: classNamespace,
        name: className
    });

    // load routes
    let routes = {};
    if(tools.fileExists(routesFile)) {
        try {
            routes = JSON.parse(fs.readFileSync(routesFile));
        } catch (err) {
            console.warn('- WARNING: could not read routes from ' + routesFile);
            console.error(err);
            return;
        }
    }

    // add route
    let route = '/' + relativePath.replace(/\\+/g, '/').replace(/^\/+/, '').replace(/\/+$/, '') + '/' + className.toLowerCase() + '/?(\\?.*)?';
    route = route.replace(/^\/\//g, '/');
    if(!routes[route]) {
        console.log('- Adding route');
        routes[route] = classNamespace + '\\' + className;
        try {
            fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2), 'utf8');
        } catch (err) {
            console.warn('\n- WARNING: could not save routes');
            console.error(err);
        }
    } else {
        console.log('- WARNING: route already exists:\n' + route);
    }

    console.log('Finished!');
};