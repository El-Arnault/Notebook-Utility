#!/usr/bin/env node

/* ArgError */
function ArgError(message) {
    this.message = message;
    this.stack = (new Error()).stack;
}
ArgError.prototype = Object.create(Error.prototype);

/* NoteList */
function NoteList() {
    this.list = undefined;
    this._counter = 0;
    this.deserialize();
}
Object.defineProperty(NoteList.prototype, "counter", { 
    get: function() { return this._counter }
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
}
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
function printMan() {
    console.log("Options:");
    console.log("-add (--add)    [entry]  Add a note");
    console.log("-del (--delete) [index]  Delete a note with the given index");
    console.log("-p   (--print)           Print the list of notes");
    console.log("-cl  (--clear)           Clear the list");
}

/* Main Logic */
var note = new NoteList();
var argv = process.argv.slice(2);
try {
    if (argv.length == 0)
        console.log('Call "notes" with -h or --help to get information about all available options');
    else {
        switch(argv[0]) {
        case "-add": case "--add":
            var str = argv[1];
            for (let i = 2; i < argv.length; i++) {
                str += " " + argv[i];
            }
            note.add(str);
            note.serialize();
            break;
        case "-del": case "--delete":
            let index = Number(argv[1]);
            if (!Number.isInteger(index)) {
                throw new ArgError("Argument for delete must be a number");
            }
            note.delete(index);
            note.serialize();
            break;
        case "-p": case "--print":
            note.print();
            break;
        case "-cl": case "--clear":
            note.clear();
            note.serialize();
            break;
        case "-h": case "--help":
            printMan();
            break;
        default:
            throw new ArgError("Invalid Option");
        }
    }
} catch(err) {
    console.error(err.message);
}