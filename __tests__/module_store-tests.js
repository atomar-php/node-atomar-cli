'use strict';

jest.unmock('../module_store.js');
jest.unmock('../semver');

describe('module_store', () => {
    let store, shelljs;

    beforeEach(() => {
        store = require('../module_store');
        shelljs = require('shelljs');
    });

    it('should look up a module', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');

        let module = store.lookup_module('atomar', '*');
        expect(module.version).toEqual('0.2');
    });

    it('should look up a module version', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');

        let module = store.lookup_module('atomar', '0.1.1');
        expect(module.version).toEqual('0.1.1');
    });

    it('should look up a module version and fall back to wildcard', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');

        let module = store.lookup_module('atomar', '3.0');
        expect(module).toEqual(null);
    });

    it('should support integer version numbers', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');

        let module = store.lookup_module('atomar', 3);
        expect(module).toEqual(null);
    });

    it('should fail to look up a module', () => {
        shelljs.__queueStdout = JSON.stringify({
            message: 'Not found'
        });

        let module = store.lookup_module('atomar');
        expect(module).toEqual(null);
    });
});