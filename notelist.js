const ArgumentError = require("./argerror.js");

/* NoteList */

const file = "data.json";

function NoteList() {
    this.list = undefined;
    this._counter = 0;
    this.deserialize();
}

Object.defineProperty(NoteList.prototype, "counter", {
    get: function() { return this._counter; }
});

NoteList.prototype.toArray = function() {
    var list = [];
    var current = this.list;
    while (current != undefined) {
        list.unshift(current.value);
        current = current.next;
    }
    return list;
};

NoteList.prototype.fromArray = function(data) {
    data.forEach((entry) => {
        this.add(entry);
    });
};

NoteList.prototype.add = function(val) {
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

NoteList.prototype.delete = function(number) {
    if (this._counter < number) {
        /* Out of bounds query */
        throw new ArgumentError("No such note found :c");
    } else {
        /* Locate entry */
        number = this._counter + 1 - number;
        var current = this.list;
        for (let i = 1; i < number; i++) {
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
    let fd = -1;
    do {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
        fd = fs.openSync(file, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_EXCL, 0640);
    } while (fd < 0);
    fs.writeFileSync(fd, JSON.stringify(data));
    fs.closeSync(fd);
};

NoteList.prototype.deserialize = function() {
    const fs = require("fs");
    if (fs.existsSync(file)) {
        var string = fs.readFileSync(file);
        var data = JSON.parse(string);
        this.fromArray(data);
    }
};

module.exports = NoteList;