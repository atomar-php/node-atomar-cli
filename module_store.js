// This is a light module registry wrapper.
// If things get really popular we may place the modules in a proper
// registry and update this module to access it.

var modules = {
    atomar: {
        owner: 'neutrinog',
        repo: 'atomar.git'
    },
    auth_token: {
        owner: 'neutrinog',
        repo: 'atomar-auth_token.git'
    },
    captcha: {
        owner: 'neutrinog',
        repo: 'atomar-captcha.git'
    },
    chardin_steps: {
        owner: 'neutrinog',
        repo: 'atomar-chardin_steps.git'
    },
    tiny_cms: {
        owner: 'neutrinog',
        repo: 'atomar-tiny_cms.git'
    },
    crypto: {
        owner: 'neutrinog',
        repo: 'atomar-crypto.git'
    },
    debug: {
        owner: 'neutrinog',
        repo: 'atomar-debug.git'
    },
    fancy_fields: {
        owner: 'neutrinog',
        repo: 'atomar-fancy_fields.git'
    },
    file_drop: {
        owner: 'neutrinog',
        repo: 'atomar-files.git'
    },
    google_data: {
        owner: 'neutrinog',
        repo: 'atomar-google_data.git'
    },
    image_utils: {
        owner: 'neutrinog',
        repo: 'atomar-image_utils.git'
    },
    infinite_scroll: {
        owner: 'neutrinog',
        repo: 'atomar-infinite_scroll.git'
    },
    js_front: {
        owner: 'neutrinog',
        repo: 'atomar-js_front.git'
    },
    i18n: {
        owner: 'neutrinog',
        repo: 'atomar-i18n.git'
    },
    podcast: {
        owner: 'neutrinog',
        repo: 'atomar-podcast.git'
    },
    recaptcha: {
        owner: 'neutrinog',
        repo: 'atomar-recaptcha.git'
    }
};

module.exports = {
    lookup_module: function(name, version) {
        // TODO: in the future we will support installing a specific version
        return modules[name] || null;
    }
};