'use strict';

jest.unmock('../module_store.js');
jest.unmock('../semver');
jest.unmock('../tools.js');
jest.unmock('../config.js');
jest.unmock('mkdirp');

describe('module_store', () => {
    let store, shelljs;

    beforeEach(() => {
        store = require('../module_store');
        shelljs = require('shelljs');
    });

    it('should look up a module', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-branches-lookup.json');

        let module = store.lookup_module('atomar', '*');
        expect(module.version).toEqual('0.2');
    });

    it('should look up a module version', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-branches-lookup.json');

        let module = store.lookup_module('atomar', '0.1.1');
        expect(module.version).toEqual('0.1.1');
    });

    it('should look up a module version and fall back to wildcard', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-branches-lookup.json');

        try {
            let module = store.lookup_module('atomar', '3.0');
            expect(module).toEqual(null);
        } catch(err) {
            expect(err.message).toEqual('That version of the module does not exist');
        }
    });

    it('should look up a module by master branch', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-branches-lookup.json');

        let module = store.lookup_module('atomar', 'master');
        expect(module.ref.name).toEqual('master');
    });

    it('should look up a module by develop branch', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-branches-lookup.json');

        let module = store.lookup_module('atomar', 'develop');
        expect(module.ref.name).toEqual('develop');
    });

    it('should support integer version numbers', () => {
        let realfs = require.requireActual('fs');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-tags-lookup.json');
        shelljs.__queueStdout = realfs.readFileSync('__tests__/data/valid-branches-lookup.json');

        try {
            let module = store.lookup_module('atomar', 3);
            expect(module).toEqual(null);
        } catch(err) {
            expect(err.message).toEqual('That version of the module does not exist');
        }
    });

    it('should fail to look up a module', () => {
        shelljs.__queueStdout = JSON.stringify({
            message: 'Not found'
        });

        try {
            let module = store.lookup_module('atomar');
            expect(module).toEqual(null);
        } catch(err) {
            expect(err.message).toEqual('The module could not be found');
        }
    });
});