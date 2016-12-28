'use strict';

let modules = [];

/**
 * Gives the next value in an array or null
 * @param array
 * @returns {*}
 */
function shift(array) {
    if(array.length > 0) {
        return array.shift();
    } else {
        return null;
    }
}

module.exports = {
    set __queueModules(module) {
        modules.push(module);
    },
    lookup_module: jest.fn(function(name, version) {
        return shift(modules);
    })
};