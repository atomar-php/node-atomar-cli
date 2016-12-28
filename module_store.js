'use strict';

let shell = require('shelljs');
const compareVersions = require('compare-versions');

/**
 * Searches for a module on github
 * @return {Promise}
 */
function lookup_github(name, version) {
    let fullname = name.split('/');
    if(fullname.length > 2 || fullname.length == 0) return Promise.reject('Invalid module name: "' + fullname + '"');

    // default to atomar-php owner
    if(fullname.length == 0) fullname.unshift('atomar-php');

    let owner = fullname[0];
    let module_slug = fullname[1].replace(/^atomar\-/, '');
    let repo = /^atomar/.test(module_slug) ? module_slug : 'atomar-' + module_slug;


    let tags_url = 'https://api.github.com/repos/' + owner + '/' + repo + '/tags';
    return curl(tags_url)
        .then(function(tags) {
            if(tags.length > 0) {
                if(typeof version === 'string') {
                    tags.forEach(function(tag) {
                        if(compareVersions(tag.name, version) === 0) {
                            return Promise.resolve(tag);
                        }
                    });
                } else {
                    return Promse.resolve(tags[0]);
                }
            }
            return Promise.resolve(null);
        })
        .then(function(tag) {
            return Promise.resolve({
                commit: tag ? tag.commit.sha : null,
                owner: owner,
                slug: module_slug,
                repo: repo,
                clone: {
                    http: 'https://github.com/' + owner + '/' + repo,
                    ssh: 'git@github.com:' + owner + '/' + repo
                }
            });
            // if(tag === null) {
            //     console.log('Warning: checking out master branch');
            // }
            // clone
            // let url = 'https://api.github.com/' + user + '/' + repo;
        });
}

/**
 * Performs a curl and gives the response as a json object
 * @param url
 * @return {Promise}
 */
function curl(url) {
    shell.exec('curl ' + url, {silent:true}, function(code, stdout, stderr) {
        try {
            resolve(JSON.parse(stdout));
        } catch(err) {
            reject(err);
        }
        // TODO: handle curl errors
    });
}

module.exports.lookup_module = lookup_github;

var modules = {
    atomar: {
        owner: 'atomar-php',
        repo: 'atomar.git'
    },
    auth_token: {
        owner: 'atomar-php',
        repo: 'atomar-auth_token.git'
    },
    captcha: {
        owner: 'atomar-php',
        repo: 'atomar-captcha.git'
    },
    chardin_steps: {
        owner: 'atomar-php',
        repo: 'atomar-chardin_steps.git'
    },
    tiny_cms: {
        owner: 'atomar-php',
        repo: 'atomar-tiny_cms.git'
    },
    crypto: {
        owner: 'atomar-php',
        repo: 'atomar-crypto.git'
    },
    debug: {
        owner: 'atomar-php',
        repo: 'atomar-debug.git'
    },
    fancy_fields: {
        owner: 'atomar-php',
        repo: 'atomar-fancy_fields.git'
    },
    files: {
        owner: 'atomar-php',
        repo: 'atomar-files.git'
    },
    google_data: {
        owner: 'atomar-php',
        repo: 'atomar-google_data.git'
    },
    image_utils: {
        owner: 'atomar-php',
        repo: 'atomar-image_utils.git'
    },
    infinite_scroll: {
        owner: 'atomar-php',
        repo: 'atomar-infinite_scroll.git'
    },
    js_front: {
        owner: 'atomar-php',
        repo: 'atomar-js_front.git'
    },
    i18n: {
        owner: 'atomar-php',
        repo: 'atomar-i18n.git'
    },
    podcast: {
        owner: 'atomar-php',
        repo: 'atomar-podcast.git'
    },
    recaptcha: {
        owner: 'atomar-php',
        repo: 'atomar-recaptcha.git'
    }
};
//
// module.exports = {
//     lookup_module: function(name, version) {
//         // TODO: in the future we will support installing a specific version
//         return modules[name] || null;
//     }
// };