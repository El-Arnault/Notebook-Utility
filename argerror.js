/* Argument Error */
function ArgumentError(message) {
    this.message = message;
    this.stack = (new Error()).stack;
}
ArgumentError.prototype = Object.create(Error.prototype);

module.exports = ArgumentError;