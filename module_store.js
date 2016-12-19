// This is a light module registry wrapper.
// If things get really popular we may place the modules in a proper
// registry and update this module to access it.

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

module.exports = {
    lookup_module: function(name, version) {
        // TODO: in the future we will support installing a specific version
        return modules[name] || null;
    }
};