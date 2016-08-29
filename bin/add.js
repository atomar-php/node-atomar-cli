exports.command = 'add <component>';
exports.describe = 'Adds a new component';
exports.builder = function(yargs) {
    return yargs.commandDir('./add');
};
exports.handler = function(argv) {};