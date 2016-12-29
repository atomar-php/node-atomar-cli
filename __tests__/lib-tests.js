'use strict';

jest.unmock('../lib.js');
jest.unmock('../tools.js');
jest.unmock('../config.js');
jest.unmock('mkdirp');
jest.unmock('path');
jest.mock('fs');

describe('lib', () => {
    let lib, modstore, tools;

    beforeEach(() => {
        lib = require('../lib');
        tools = require('../tools');
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
            lib.install_module('atomar', '*', 'out/files', false);
            expect(tools.fileExists('atomar.json')).toBeTruthy();
        });
    });
});