exports.command = 'controller <type>';
exports.describe = 'Adds a new controller component';
exports.builder = function(yargs) {
    return yargs.commandDir('./controller');
};
exports.handler = function(argv) {};