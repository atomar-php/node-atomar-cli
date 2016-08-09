exports.command = 'link <name> [stuff]';
exports.describe = 'Links a site to the index';
exports.builder = {
    banana: {
        default: 'cool'
    },
    batman: {
        default: 'sad'
    }
};
exports.handler = function(argv) {
    console.log('linking things');
};