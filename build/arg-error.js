/*       */

/**
 * Module contains definition of Argument Error class.
 */

function ArgumentError(message         ) {
    this.message = message;
    this.stack = (new Error()).stack;
}
ArgumentError.prototype = Object.create(Error.prototype);

module.exports = ArgumentError;