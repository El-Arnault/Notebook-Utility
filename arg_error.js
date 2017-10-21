/* ArgError */
function ArgError(message) {
    this.message = message;
    this.stack = (new Error()).stack;
}
ArgError.prototype = Object.create(Error.prototype);

module.exports = ArgError;