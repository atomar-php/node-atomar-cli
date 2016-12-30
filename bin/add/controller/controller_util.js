'use strict';

const path = require('path');
const mkdirp = require('mkdirp');
const tools = require('../../../tools');
const atomar_config = require('../../../config');
const fs = require('fs');

module.exports = {
    /**
     * Performs initial processing on controller args
     * @param argv
     * @param opts
     */
    prepare: function(argv, opts={}) {
        let defaults = {
            view_prefix: '',
            route_suffix: ''
        };
        opts = Object.assign({}, defaults, opts);

        let info = atomar_config.loadPackage();
        if(!info) throw new Error('Not an Atomar module. Try running inside a module.');
        let name = argv.name.replace(/\.php$/i, '').replace(/^\/+/, '');
        let relativePath = '';

        // extract path
        if(name.indexOf('/') !== -1) {
            relativePath = path.dirname(name);
            name = path.basename(name);
            console.log('\n- Extracting path: ' + relativePath);
        }

        // prepare paths
        let className = tools.className(name);
        let classDir = atomar_config.controllers_dir;
        let viewDir = atomar_config.views_dir;
        if(relativePath !== '') {
            classDir = path.join(classDir, relativePath);
            viewDir = path.join(viewDir, relativePath);
        }
        let classFile = path.join(process.cwd(), classDir,  className + '.php');
        let viewFile = path.join(process.cwd(), viewDir, opts.view_prefix + className.toLowerCase() + '.html');
        let classNamespace = info.name + '\\' + classDir.replace(/\/+/g, '\\');
        let routesFile = path.join(process.cwd(), atomar_config.routes_dir, 'public.json');

        // skip duplicates
        if(tools.fileExists(classFile)) {
            throw new Error('The path already exists: ' + classFile);
        }

        mkdirp.sync(path.dirname(viewFile));
        mkdirp.sync(path.dirname(classFile));
        mkdirp.sync(path.dirname(routesFile));

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
        let route = '/' + relativePath.replace(/\\+/g, '/').replace(/^\/+/, '').replace(/\/+$/, '') + '/' + className.toLowerCase() + opts.route_suffix + '/?(\\?.*)?';
        route = route.replace(/^\/\//g, '/');
        if(!routes[route]) {
            routes[route] = classNamespace + '\\' + className;
        } else {
            console.log('- WARNING: route already exists:\n' + route);
        }

        return {
            className: className,
            classFile: classFile,
            classNamespace: classNamespace,
            module_info: info,
            viewDir: viewDir,
            viewFile: viewFile,
            routes: routes,
            routesFile: routesFile,
        }
    },
    writeRoute: function(routesFile, routes) {
        try {
            fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2), 'utf8');
        } catch (err) {
            console.warn('\n- WARNING: could not save routes');
            console.error(err);
        }
    }
};