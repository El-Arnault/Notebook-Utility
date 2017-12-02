/* @flow */

/**
 * Module contains definition of Argument Error class.
 */

export default class ArgumentError extends Error {
    constructor(message: string) {
        super(message);
        this.message = message;
        this.stack = (new Error()).stack;
    }
}