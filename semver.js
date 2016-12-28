'use strict';

/**
 * Compares two Version strings
 * -1 v1 is less than v2
 * 0 both are equal
 * 1 v1 is greater than v2
 *
 * @param v1
 * @param v2
 */
function semver(v1, v2) {
    let ver1 = new Version(v1);
    let ver2 = new Version(v2);

    let max = Math.max(ver1.size(), ver2.size());
    for(let i = 0; i < max; i ++) {
        if(ver1.isWild(i) || ver2.isWild(i)) continue;
        if(ver1.get(i) > ver2.get(i)) return 1;
        if(ver1.get(i) < ver2.get(i)) return -1;
    }
    return 0;
}

function Version(v) {
    let slices = v.split('\.');

    /**
     * Removes all non-numeric characters except for an asterisk
     * @param v
     */
    const clean = function(v) {
        v = v.replace(/[^\d\* ]/, '');
        if(v === '') v = '0';
        return v;
    };

    return {
        /**
         * Returns the value at the given semver index
         * @param index
         * @returns int the integer value of the Version position
         */
        get: function(index) {
            if(index >= 0 && index < slices.length) {
                let v = clean(slices[index]);
                return parseInt(v);
            } else {
                return 0;
            }
        },
        /**
         * Checks if the value at the index is an asterisk (wild card)
         * @param index
         * @returns {boolean}
         */
        isWild: function(index) {
            if(index >= slices.length) index = slices.length -1;
            if(index < 0) index = 0;

            if(slices.length > 0) {
                return clean(slices[index]) === '*';
            } else {
                return false;
            }
        },
        size: function() {
            return slices.length;
        }
    };
}

module.exports = semver;