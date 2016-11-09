'use strict';

jest.unmock('../lib.js');
jest.unmock('rimraf');
jest.unmock('../module_store.js');
jest.unmock('shelljs');

describe('lib', () => {
    var lib;

    beforeEach(() => {
        lib = require('../lib');
        var rimraf = require('rimraf');
        rimraf.sync('out');
    });

    describe('Install', () => {
        it('should clone a module', () => {
            lib.install_module('files', 'out/files', false);
            expect(lib.fileExists('out/files')).toBeTruthy();
        });
    });
});