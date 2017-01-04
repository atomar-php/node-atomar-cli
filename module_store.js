'use strict';

let shell = require('shelljs');
let atomar_config = require('./config');
const semver = require('./semver');

/**
 * Searches for a module on github
 * @return {Promise}
 */
function lookup_github(name, version) {
    if(typeof version === 'undefined') version = '*';
    if(typeof version === 'number')  version += ''; // convert to string
    let fullname = name.split('/');
    if(fullname.length > 2 || fullname.length == 0) throw new Error('Invalid module name: "' + name + '"');

    // default to atomar-php owner
    if(fullname.length == 1) fullname.unshift(atomar_config.repo_owner);

    let owner = fullname[0];
    let module_slug = fullname[1].replace(/^atomar\-/, '');
    let repo = /^atomar/.test(module_slug) ? module_slug : atomar_config.repo_prefix + module_slug;

    let ref = loadTag(owner, repo, version);
    if(ref === null) {
        // check branches
        ref = loadBranch(owner, repo, version);
    }

    if(ref === null && version !== '*') {
        throw new Error('That version of the module does not exist');
    }

    return {
        ref: ref,
        version: ref ? ref.name : '*',
        owner: owner,
        slug: module_slug,
        repo: repo,
        clone: {
            http: 'https://github.com/' + owner + '/' + repo,
            ssh: 'git@github.com:' + owner + '/' + repo
        }
    };
}

/**
 * Looks up a branch by version (a.k.a name)
 * @param owner the github owner
 * @param repo the repository
 * @param version the branch name
 * @returns {*}
 */
function loadBranch(owner, repo, version) {
    // fetch branches
    let branches_url = 'https://api.github.com/repos/' + owner + '/' + repo + '/branches';
    let branches = curl(branches_url);

    // repo does not exist
    if(branches.message) throw new Error('The module could not be found');

    // load from branches
    let branch = null;
    if(version !== '*') {
        // find exact version
        branch = findName(branches, version);
    } else if(branches.length > 0) {
        // try for master first
        branch = findName(branches, 'master');
        if(branch === null) {
            // get the first available branch
            branch = branches[0];
        }
    }
    return branch;
}

/**
 * Looks up a tag by version (a.k.a name)
 * @param owner the github owner
 * @param repo the repository
 * @param version the tag name
 * @returns {*}
 */
function loadTag(owner, repo, version) {
    // fetch tags
    let tags_url = 'https://api.github.com/repos/' + owner + '/' + repo + '/tags';
    let tags = curl(tags_url);

    // repo does not exist
    if(tags.message) throw new Error('The module could not be found');

    // load from tags
    let tag = null;
    if(version !== '*') {
        // find exact version
        for(let i = 0; i < tags.length; i ++) {
            if(semver(tags[i].name, version) === 0) {
                tag = tags[i];
                break;
            }
        }
    } else {
        // get most recent version
        tag = tags[0];
    }
    return tag;
}

/**
 * Looks for an object with a matching name property
 * @param array {[]} an array of objects
 * @param name {string} the name to match
 * @return {{}|null} the matched object or null
 */
function findName(array, name) {
    for(let i = 0; i < array.length; i ++) {
        if(array[i].name === name) {
            return array[i];
        }
    }
    return null;
}

/**
 * Performs a curl and gives the response as a json object
 * @param url
 * @return
 */
function curl(url) {
    let stdout = shell.exec('curl ' + url, {silent:true}).stdout;
    return JSON.parse(stdout);
    // TODO: handle curl errors
}

module.exports.lookup_module = lookup_github;