'use strict';

let codes = [];
let stdouts = [];
let stderrs = [];

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

let shelljs = {
    set __queueCode(code) {
        codes.push(code);
    },
    set __queueStdout(out) {
        stdouts.push(out);
    },
    set __queueStderr(err) {
        stderrs.push(err);
    },

    exec: jest.fn(function(cmd, options, callback) {
        if(typeof callback === 'function') {
            callback(shift(codes), shift(stdouts), shift(stderrs));
        } else {
            return {
                code: shift(codes),
                stdout: shift(stdouts),
                stderr: shift(stderrs)
            }
        }
    })
};

module.exports = shelljs;