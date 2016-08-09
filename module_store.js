// This is a light module registry wrapper.
// If things get really popular we may place the modules in a proper
// registry and update this module to access it.

var modules = {
    atomar: {
        owner: 'neutrinog',
        repo: 'atomar.git'
    }
};

module.exports = {
    lookup_module: function(name, version) {
        // TODO: in the future we will support installing a specific version
        return modules[name] || null;
    }
};