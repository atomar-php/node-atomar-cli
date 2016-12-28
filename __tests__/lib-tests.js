'use strict';

jest.unmock('../lib.js');
jest.unmock('path');
jest.mock('fs');

describe('lib', () => {
    let lib, modstore;

    beforeEach(() => {
        lib = require('../lib');
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
                }
            };
            lib.install_module('atomar', 'out/files', false);
            expect(lib.fileExists('atomar.json')).toBeTruthy();
        });

        it('should fail to clone a module', () => {
            modstore.__queueModules = null;
            try {
                lib.install_module('atomar', 'out/files', false);
                expect(lib.fileExists('atomar.json')).not.toBeTruthy();
            } catch (err) {
                expect(err.message).toEqual('The module "atomar" does not exist.');
            }
        });
    });
});