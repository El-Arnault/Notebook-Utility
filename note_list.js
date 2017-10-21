/* NoteList */
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
        list.push(current.value);
        current = current.next;
    }
    return list;
};

NoteList.prototype.fromArray = function(data) {
    var len = data.length;
    for (let i = len - 1; i >= 0; i--) {
        this.add(data[i]);
    }
};

NoteList.prototype.add = function(val) {
    var entry = {
        previous : undefined,
        next : undefined,
        value : val
    };
    entry.next = this.list;
    if (this.list != undefined) {
        this.list.previous = entry;
    }
    this.list = entry;
    this._counter++;
};

NoteList.prototype.delete = function(number) {
    if (this._counter < number) {
        console.error("Index out of border");
    } else {
        var current = this.list;
        for (let i = 1; i < number; i++) {
            current = current.next;
        }
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
};

NoteList.prototype.clear = function() {
    this._counter = 0;
    this.list = undefined;
};

NoteList.prototype.print = function() {
    console.log("      Notebook     ");
    console.log("-------------------");
    var list = this.toArray();
    var i = 1;
    for (let entry of list) {
        console.log(`${i++}) ${entry}`);
    }
    console.log("-------------------");
};

NoteList.prototype.serialize = function() {
    const fs = require("fs");
    var data = this.toArray();
    fs.writeFileSync("data.json", JSON.stringify(data));
};

NoteList.prototype.deserialize = function() {
    const fs = require("fs");
    if (fs.existsSync("data.json")) {
        var string = fs.readFileSync("data.json");
        var data = JSON.parse(string);
        this.fromArray(data);
    }
};

module.exports = NoteList;