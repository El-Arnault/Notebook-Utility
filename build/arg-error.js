"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Module contains definition of Argument Error class.
 */

var ArgumentError = function (_Error) {
    _inherits(ArgumentError, _Error);

    function ArgumentError(message) {
        _classCallCheck(this, ArgumentError);

        var _this = _possibleConstructorReturn(this, (ArgumentError.__proto__ || Object.getPrototypeOf(ArgumentError)).call(this, message));

        _this.message = message;
        _this.stack = new Error().stack;
        return _this;
    }

    return ArgumentError;
}(Error);

exports.default = ArgumentError;