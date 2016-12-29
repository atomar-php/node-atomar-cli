'use strict';

jest.unmock('../lib.js');
jest.unmock('../tools.js');
jest.unmock('../config.js');
jest.unmock('mkdirp');
jest.unmock('path');
jest.mock('fs');

describe('lib', () => {
    let lib, modstore, tools, fs, atomar_config, path;

    beforeEach(() => {
        fs = require('fs');
        lib = require('../lib');
        tools = require('../tools');
        atomar_config = require('../config');
        path = require('path');
        modstore = require('../module_store');
    });

    describe('Install', () => {
        it('should clone a module', () => {
            modstore.__queueModules = {
                owner: 'atomar-php',
                slug: 'atomar',
                repo: 'atomar',
                version: '0.2',
                clone: {
                    http: 'https://github.com/atomar-php/atomar'
                },
                tag: {
                    "name": "0.2",
                    "zipball_url": "https://api.github.com/repos/atomar-php/atomar/zipball/0.2",
                    "tarball_url": "https://api.github.com/repos/atomar-php/atomar/tarball/0.2",
                    "commit": {
                        "sha": "ce73a60d59018cb8ccc0994e72af3fd15d3cf3aa",
                        "url": "https://api.github.com/repos/atomar-php/atomar/commits/ce73a60d59018cb8ccc0994e72af3fd15d3cf3aa"
                    }
                }
            };
            let config_path = path.join(process.cwd(), atomar_config.package_file);
            fs.writeFileSync(config_path, '{}');
            let result = lib.install_module('atomar', '*', 'out/files', false);
            expect(result).toBeTruthy();
        });
    });
});