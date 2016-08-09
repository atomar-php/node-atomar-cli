exports.command = 'update <name> [stuff]';
exports.describe = 'Updates the installation of atomic';
exports.builder = {
    banana: {
        default: 'cool'
    },
    batman: {
        default: 'sad'
    }
};
exports.handler = function(argv) {
    console.log('updating things');
};