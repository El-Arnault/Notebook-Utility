/* @flow */

/**
 * Module contains note list and operation buffer class definitions.
 */

//TODO: track changes

const ArgumentError = require('./arg-error.js');
const fs = require('fs');

/**
 * Entry class.
 */
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

/**
 * Note List class.
 */
class NoteList {
  list: ?Entry;
  _counter: number;
  _last: ?Entry;

  constructor() {
    this.list = undefined;
    this._counter = 0;
    this._last = undefined;
  }

  count() {
    return this._counter;
  }

  static fromFile(file: string): NoteList {
    let notelist = new NoteList();
    notelist.deserialize(file);
    return notelist;
  }

  toArray(): string[] {
    let list = [];
    let current: ?Entry = this.list;
    while (current != undefined) {
      list.push(current.value);
      current = current.next;
    }
    return list;
  }

  fromArray(data: string[]) {
    for (let i = data.length - 1; i >= 0; i--) {
      this.add(data[i], 0);
    }
  }

  at(pos: number): Entry {
    if (pos < 0 || pos >= this._counter) {
      throw new ArgumentError('no such note :c');
    } else {
      let entry: Entry = (this.list: any);
      //TODO: optimize for adding to the end
      for (let i = 0; i < pos; i++) {
        entry = (entry.next: any);
      }
      return entry;
    }
  }

  add(value: string, pos: number) {
    /* Create entry */
    let entry = new Entry(value);
    /* Tether the note */
    pos = Math.max(Math.min(this._counter - 1, pos), 0);
    if (pos === 0) {
      /* Add to the beginning */
      if (this.list != undefined) {
        /* There are entries */
        this.list.previous = entry;
      } else {
        /* This is the first entry */
        this._last = entry;
      }
      entry.next = this.list;
      this.list = entry;
      this._counter++;
    } else if (pos === this._counter - 1) {
      /* Add to the end which is not a start */
      (this._last: any).next = entry;
      entry.previous = this._last;
      this._last = entry;
      this._counter++;
    } else {
      /* Add somewhere in the middle */
      let after: Entry = this.at(pos - 1);
      entry.previous = after;
      entry.next = after.next;
      (entry.next: any).previous = entry;
      after.next = entry;
      this._counter++;
    }
  }

  delete(index: number): Entry {
    if (index >= this._counter || index < 0) {
      /* Out of bounds query */
      throw new ArgumentError("Didn't find a note to delete :c");
    } else {
      /* Delete the note */
      if (index === 0) {
        /* Delete from the beginning */
        let entry: Entry = (this.list: any);
        this.list = entry.next;
        if (entry.next != undefined) {
          /* There are more notes */
          entry.next.previous = undefined;
        } else {
          /* This is the only note */
          this._last = undefined;
        }
        this._counter--;
        entry.next = undefined;
        return entry;
      } else if (index === this._counter - 1) {
        /* Delete the last note */
        let entry: Entry = (this._last: any);
        (entry.previous: any).next = undefined;
        this._last = entry.previous;
        this._counter--;
        entry.previous = undefined;
        return entry;
      } else {
        /* Delete a note somewhere in the middle */
        let entry: Entry = this.at(index);
        (entry.previous: any).next = entry.next;
        (entry.next: any).previous = entry.previous;
        this._counter--;
        entry.previous = undefined;
        entry.next = undefined;
        return entry;
      }
    }
  }

  move(from: number, to: number) {
    let entry = this.delete(from);
    this.add(entry.value, to);
  }

  swap(i: number, j: number) {
    /* Sort indeces */
    if (i > j) {
      let temp = i;
      i = j;
      j = temp;
    }

    /* Find blocks */
    let bi = this.at(i);
    let bj = this.at(j);

    /* Rethether blocks */
    if (i === j) {
      /* Nothing to do */
      return;
    } else if (i == j - 1) {
      /* Adjacent elements */
      let bk = bi.previous;
      let bl = bj.next;
      bi.next = bl;
      bj.previous = bk;
      bi.previous = bj;
      bj.next = bi;
      if (bk != undefined) {
        /* i-th note is not the first */
        bk.next = bj;
      } else {
        /* i-th note is the first */
        this.list = bj;
      }
      if (bl != undefined) {
        /* j-th note is not the last */
        bl.previous = bi;
      } else {
        /* j-th note is the last */
        this._last = bi;
      }
    } else {
      /* Separated blocks */
      let bk = bi.previous;
      let bl = bj.next;
      let bn = bi.next;
      let bm = bj.previous;
      bi.next = bl;
      bi.previous = bm;
      bj.previous = bk;
      bj.next = bn;
      if (bk != undefined) {
        /* i-th note is not the first */
        bk.next = bj;
      } else {
        /* i-th note is the first */
        this.list = bj;
      }
      if (bl != undefined) {
        /* j-th note is not the last */
        bl.previous = bi;
      } else {
        /* j-th note is the last */
        this._last = bi;
      }
      if (bn != undefined) {
        bn.previous = bj;
      }
      if (bm != undefined) {
        bm.next = bi;
      }
    }
  }

  clear() {
    this._counter = 0;
    this.list = undefined;
  }

  print(): string {
    if (this._counter === 0) {
      return 'empty...';
    } else {
      let last = this._counter - 1;
      return this.toArray().reduce((previous, current, index) => {
        let result = `${previous}${index + 1}) ${current}`;
        if (index != last) {
          return result + '\n';
        } else {
          return result;
        }
      }, '');
    }
  }

  serialize(file: string) {
    let data = this.toArray();
    fs.writeFileSync(file, JSON.stringify(data), {
      encoding: 'utf8',
      mode: 0o640,
      flag: 'w'
    });
  }

  deserialize(file: string) {
    if (fs.existsSync(file)) {
      let contents = fs.readFileSync(file, {
        encoding: 'utf8'
      });
      let data: string[] = JSON.parse(contents);
      this.fromArray(data);
    }
  }
}

module.exports = NoteList;
