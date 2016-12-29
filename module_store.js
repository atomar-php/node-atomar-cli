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


    let tags_url = 'https://api.github.com/repos/' + owner + '/' + repo + '/tags';
    let tags = curl(tags_url);

    // repo does not exist
    if(tags.message) throw new Error('The module could not be found');

    let tag = null;
    if(version !== '*') {
        // find exact version
        for(let i = 0; i < tags.length; i ++) {
            if(semver(tags[i].name, version) === 0) {
                tag = tags[i];
                break;
            }
        }
        if(tag == null) throw new Error('That version of the module does not exist');
    } else {
        // get most recent version
        tag = tags[0];
    }

    return {
        commit: tag ? tag.commit.sha : null,
        version: tag ? tag.name : '*',
        owner: owner,
        slug: module_slug,
        repo: repo,
        tags_url: tags_url,
        clone: {
            http: 'https://github.com/' + owner + '/' + repo,
            ssh: 'git@github.com:' + owner + '/' + repo
        }
    };
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