'use strict';

jest.unmock('../lib.js');
jest.unmock('rimraf');
jest.unmock('path');
jest.mock('fs');

describe('lib', () => {
    var lib, modstore;

    beforeEach(() => {
        lib = require('../lib');
        modstore = require('../module_store');
        var rimraf = require('rimraf');
        rimraf.sync('out');
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
                }
            };
            lib.install_module('files', 'out/files', false);
            expect(lib.fileExists('out/files')).toBeTruthy();
        });
    });
});