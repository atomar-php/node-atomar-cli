'use strict';

jest.unmock('../module_store.js');

describe('module_store', () => {
    let store, shelljs;

    beforeEach(() => {
        store = require('../module_store');
        shelljs = require('shelljs');
    });

    it('should look up a module', () => {
        let realfs = require.requireActual('fs');
        let data = realfs.readFileSync('__tests__/data/valid-module-lookup.json');
        shelljs.__queueStdout = data;

        return store.lookup_module('atomar-php', 'atomar')
            .then(function(response) {
                console.log(response);
                // TODO: handle
            });
    });
});