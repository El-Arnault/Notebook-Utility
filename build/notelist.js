"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _argError = require("./arg-error.js");

var _argError2 = _interopRequireDefault(_argError);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Module contains notre list class definition.
 */

var Entry = function Entry(value) {
    _classCallCheck(this, Entry);

    this.previous = undefined;
    this.next = undefined;
    this.value = value;
};

var NoteList = function () {
    function NoteList() {
        _classCallCheck(this, NoteList);

        this.list = undefined;
        this._counter = 0;
    }

    _createClass(NoteList, [{
        key: "toArray",
        value: function toArray() {
            var list = [];
            var current = this.list;
            while (current != undefined) {
                list.unshift(current.value);
                current = current.next;
            }
            return list;
        }
    }, {
        key: "fromArray",
        value: function fromArray(data) {
            var _this = this;

            data.forEach(function (entry) {
                return _this.add(entry);
            });
        }
    }, {
        key: "add",
        value: function add(value) {
            var entry = new Entry(value);
            entry.next = this.list;
            if (this.list != undefined) {
                this.list.previous = entry;
            }
            this._counter++;
            this.list = entry;
        }
    }, {
        key: "delete",
        value: function _delete(index) {
            if (this._counter < index || index <= 0) {
                /* Out of bounds query */
                throw new _argError2.default("No such note found :c");
            } else {
                /* Locate entry */
                index = this._counter + 1 - index;
                var current = this.list;
                for (var i = 1; i < index; i++) {
                    current = current.next;
                }
                /* Delete found entry */
                if (current.previous != undefined) {
                    current.previous.next = current.next;
                } else {
                    this.list = current.next;
                }
                if (current.next != undefined) {
                    current.next.previous = current.previous;
                }
                this._counter--;
            }
        }
    }, {
        key: "clear",
        value: function clear() {
            this._counter = 0;
            this.list = undefined;
        }
    }, {
        key: "print",
        value: function print() {
            if (this._counter == 0) {
                return "empty...";
            } else {
                var last = this._counter - 1;
                return this.toArray().reduce(function (previous, current, index) {
                    var result = "" + previous + (index + 1) + ") " + current;
                    if (index != last) {
                        return result + "\n";
                    } else {
                        return result;
                    }
                }, "");
            }
        }
    }, {
        key: "serialize",
        value: function serialize(file) {
            var data = this.toArray();
            _fs2.default.writeFileSync(file, JSON.stringify(data), {
                "encoding": "utf-8",
                "mode": 416,
                "flag": "w"
            });
        }
    }, {
        key: "deserialize",
        value: function deserialize(file) {
            if (_fs2.default.existsSync(file)) {
                var contents = _fs2.default.readFileSync(file, {
                    "encoding": "utf-8"
                });
                var data = JSON.parse(contents);
                this.fromArray(data);
            }
        }
    }], [{
        key: "fromFile",
        value: function fromFile(file) {
            var notelist = new NoteList();
            notelist.deserialize(file);
            return notelist;
        }
    }]);

    return NoteList;
}();

exports.default = NoteList;