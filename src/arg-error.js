/* @flow */

/**
 * Module contains definition of Argument Error class.
 */
export default class ArgumentError extends Error {
    constructor(message: string) {
        super(message);
        Error.captureStackTrace(this, ArgumentError);
        this.name = this.constructor.name;
    }
}