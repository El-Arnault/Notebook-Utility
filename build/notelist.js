/*       */

/**
 * Module contains note list class definition.
 */

const ArgumentError = require("./arg-error.js");
const file = "data.json";

function NoteList() {
    this.list = undefined;
    this._counter = 0;
    this.deserialize();
}

NoteList.prototype.toArray = function()            {
    var list = [];
    var current = this.list;
    while (current != undefined) {
        list.unshift(current.value);
        current = current.next;
    }
    return list;
};

NoteList.prototype.fromArray = function(data           ) {
    data.forEach((entry) => {
        this.add(entry);
    });
};

NoteList.prototype.add = function(val         ) {
    var entry = {
        previous : undefined,
        next : undefined,
        value : val
    };
    entry.next = this.list;
    if (this.list !== undefined) {
        this.list.previous = entry;
    }
    this.list = entry;
    this._counter++;
};

NoteList.prototype.delete = function(index         ) {
    if (this._counter < index) {
        /* Out of bounds query */
        throw new ArgumentError("No such note found :c");
    } else {
        /* Locate entry */
        index = this._counter + 1 - index;
        var current = this.list;
        for (let i = 1; i < index; i++) {
            current = current.next;
        }
        /* Delete it */
        if (current.previous !== undefined) {
            current.previous.next = current.next;
        } else {
            this.list = current.next;
        }
        if (current.next !== undefined) {
            current.next.previous = current.previous;
        }
        this._counter--;
    }
};

NoteList.prototype.clear = function() {
    this._counter = 0;
    this.list = undefined;
};

NoteList.prototype.print = function() {
    console.log("      Notebook     ");
    console.log("-------------------");

    if (this._counter == 0) {
        console.log("empty...");
    } else {
        var i = 1;
        this.toArray().forEach((entry) => {
            console.log(`${i++}) ${entry}`);
        });
    }
    console.log("-------------------");
};

NoteList.prototype.serialize = function() {
    const fs = require("fs");
    let data = this.toArray();
    fs.writeFileSync(file, JSON.stringify(data), {
        "encoding" : "utf-8",
        "mode" : 0o640,
        "flag" : "w"
    });
};

NoteList.prototype.deserialize = function() {
    const fs = require("fs");
    if (fs.existsSync(file)) {
        var string = fs.readFileSync(file, {
            encoding :"utf-8"
        });
        var data = JSON.parse(string);
        this.fromArray(data);
    }
};

module.exports = NoteList;