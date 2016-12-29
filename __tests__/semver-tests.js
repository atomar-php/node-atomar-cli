'use strict';

jest.unmock('../semver');

let semver = require('../semver');

describe('semver', () => {

    /**
     * Tests that v1 is greater than v2
     * @param v1
     * @param v2
     */
    function testGreaterThan(v1, v2) {
        expect(semver(v1, v2)).toEqual(1);
    }

    /**
     * Tests that v1 is less than v2
     * @param v1
     * @param v2
     */
    function testLessThan(v1, v2) {
        expect(semver(v1, v2)).toEqual(-1);
    }

    /**
     * Tests that v1 is equal to v2
     * @param v1
     * @param v2
     */
    function testEqualTo(v1, v2) {
        expect(semver(v1, v2)).toEqual(0);
    }

    it('should be equal to', () => {
        testEqualTo("10.0.1", "10.0.1");
        testEqualTo("10.0", "10.0.0");
        testEqualTo("10.*", "10.0.0");
        testEqualTo("10.*", "10.9.0");
        testEqualTo("10.0.0", "10.0-alpha.0");
        testEqualTo("10.0.0", "v10.0.0");
        testEqualTo("10.*.1", "10.9.1");
        testEqualTo("0.8.1", "0.8.1");
        testEqualTo("0.2", "0.2.0");
        testEqualTo("0.2.0", "0.2");
        testEqualTo("0.2.0", "*");
        testEqualTo("*", "0.2");
    });

    it('should be greater than', () => {
        testGreaterThan("10.0.0", "1.0.0");
        testGreaterThan("10.1.0", "10.0.0");
        testGreaterThan("10", "9.9.0");
        testGreaterThan("10.1-alpha.0", "10.0.0");
        testGreaterThan("10.9.6", "10.*.1");
        testGreaterThan("0.9.6", "0.9.1");
        testGreaterThan("0.10.0", "0.9.*");
    });

    it('should be less than', () => {
        testLessThan("1.0.0", "10.0.0");
        testLessThan("10.0.0", "10.1.0");
        testLessThan("9.9.0", "10");
        testLessThan("10.0.0", "10.1-alpha.0");
        testLessThan("10.*.1", "10.9.6");
        testLessThan("0.9.1", "0.9.6");
        testLessThan("0.9.*", "0.10.0");
    });
});