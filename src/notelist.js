/* @flow */

/**
 * Module contains notre list class definition.
 */

import ArgumentError from "./arg-error.js";
import fs from "fs";

class Entry {

    previous: ?Entry;
    next: ?Entry;
    value: string;

    constructor(value: string) {
        this.previous = undefined;
        this.next = undefined;
        this.value = value;
    }
}

export default class NoteList {

    list: ?Entry;
    _counter: number;


    constructor() {
        this.list = undefined;
        this._counter = 0;
    }

    static fromFile(file: string): NoteList {
        let notelist = new NoteList();
        notelist.deserialize(file);
        return notelist;
    }

    toArray(): string[] {
        let list = [];
        let current = this.list;
        while (current != undefined) {
            list.unshift(current.value);
            current = current.next;
        }
        return list;
    }

    fromArray(data: string[]) {
        data.forEach(entry => this.add(entry));
    }

    add(value: string) {
        let entry = new Entry(value);
        entry.next = this.list;
        if (this.list != undefined) {
            this.list.previous = entry;
        }
        this._counter++;
        this.list = entry;
    }

    delete(index: number) {
        if (this._counter < index || index <= 0) {
            /* Out of bounds query */
            throw new ArgumentError("No such note found :c");
        } else {
            /* Locate entry */
            index = this._counter + 1 - index;
            let current: Entry = this.list;
            for (let i = 1; i < index; i++) {
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

    clear() {
        this._counter = 0;
        this.list = undefined;
    }

    print(): string {
        if (this._counter == 0) {
            return "empty...";
        } else {
            let last = this._counter - 1;
            return this.toArray().reduce((previous, current, index) => {
                let result = `${previous}${index + 1}) ${current}`;
                if (index != last) {
                    return result + "\n";
                } else {
                    return result;
                }
            }, "");
        }
    }

    serialize(file: string) {
        let data = this.toArray();
        fs.writeFileSync(file, JSON.stringify(data), {
            "encoding" : "utf-8",
            "mode" : 0o640,
            "flag" : "w"
        });
    }

    deserialize(file: string) {
        if (fs.existsSync(file)) {
            let contents = fs.readFileSync(file, {
                "encoding" : "utf-8"
            });
            let data = JSON.parse(contents);
            this.fromArray(data);
        }
    }
}