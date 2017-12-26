#!/usr/bin/env node
/* @flow */

/**
 * Notes app CLI.
 */

/* Export modules */
const NoteList = require('./notelist.js');
const ArgumentError = require('./arg-error.js');
const blessed = require('blessed');
const os = require('os');
const fs = require('fs');

/* Constants */
const padding = 1;
const controlsSize = 20;
const infoSize = 2;

/* Create a theme object */
const themeFile = `${__dirname}/../assets/theme.json`;
const theme = JSON.parse(fs.readFileSync(themeFile, { encoding: 'utf8' }));

/* Initialize a note list */
const notesFile = `${os.homedir()}/.notes.json`;
let notes = NoteList.fromFile(notesFile);

/* Create a window */
let screen = blessed.screen({
  smartCSR: true,
  title: 'notes',
  resizeTimeout: 200
});

/* Create a list with notes */
let noteWrapper = blessed.list({
  parent: screen,
  top: padding,
  left: padding,
  width: screen.width - 4 * padding - controlsSize,
  height: screen.height - 3 * padding - infoSize,
  items: notes.toArray().map((value, index) => `${index + 1}) ${value}`),
  padding: {
    left: 1,
    right: 1,
    top: 0,
    bottom: 0
  },
  scrollbar: {
    fg: theme.scrollbarColor,
    bg: theme.scrollbarBGColor,
    ch: theme.scrollbarMarker
  },
  scrollable: true,
  selectedBg: theme.focusColor,
  border: {
    type: theme.border ? 'line' : 'none'
  },
  style: {
    fg: theme.textColor,
    bg: theme.backgroundColor,
    border: {
      fg: theme.borderColor
    }
  }
});
noteWrapper.selectedIndex = 0;
noteWrapper.select(noteWrapper.selectedIndex);
screen.key(['j', 'k', 'up', 'down'], (_, key) => {
  if (key.name === 'j' || key.name === 'down') {
    // move down
    noteWrapper.selectedIndex = Math.min(
      noteWrapper.selectedIndex + 1,
      notes.count() - 1
    );
    noteWrapper.select(noteWrapper.selectedIndex);
  } else if (key.name === 'k' || key.name === 'up') {
    // move up
    noteWrapper.selectedIndex = Math.max(noteWrapper.selectedIndex - 1, 0);
    noteWrapper.select(noteWrapper.selectedIndex);
  }
  screen.render();
});

/* Create an information wrapper */
let infoWrapper = blessed.box({
  parent: screen,
  top: screen.height - padding - infoSize,
  left: padding,
  width: screen.width - 2 * padding,
  height: infoSize,
  content: '',
  padding: {
    left: 1,
    right: 1,
    top: 0,
    bottom: 0
  },
  style: {
    fg: theme.textColor,
    bg: theme.backgroundColor
  }
});

/* Create a wrapper for controls */
let controlsWrapper = blessed.box({
  parent: screen,
  top: padding,
  left: screen.width - padding - controlsSize,
  width: controlsSize,
  height: screen.height - 3 * padding - infoSize,
  content:
    '{center}Controls{/center}\n\n' +
    '{inverse} K {/inverse} - up\n' +
    '{inverse} J {/inverse} - down\n' +
    '{inverse} M {/inverse} - move\n' +
    '{inverse} D {/inverse} - delete\n' +
    '{inverse} C {/inverse} - clear\n' +
    '{inverse} A {/inverse} - add\n' +
    '{inverse} S {/inverse} - save\n' +
    '{inverse} Q {/inverse} - quit',
  tags: true,
  border: {
    type: theme.border ? 'line' : 'none'
  },
  style: {
    fg: theme.textColor,
    bg: theme.backgroundColor,
    border: {
      fg: theme.borderColor
    }
  }
});

/**
 * Function sets up sizes of all elements after window resize
 */
function setupScreen() {
  noteWrapper.width = screen.width - 4 * padding - controlsSize;
  noteWrapper.height = screen.height - 3 * padding - infoSize;
  infoWrapper.top = screen.height - padding - infoSize;
  infoWrapper.width = screen.width - 2 * padding;
  controlsWrapper.left = screen.width - padding - controlsSize;
  controlsWrapper.height = screen.height - 3 * padding - infoSize;
  screen.render();
}

/**
 * Function reads a note and adds it to the list
 */
function addNote() {
  let prompt = blessed.prompt({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '50%',
    draggable: true,
    height: 8,
    border: {
      type: theme.border ? 'line' : 'none'
    },
    style: {
      fg: theme.textColor,
      bg: theme.backgroundColor,
      border: {
        fg: theme.borderColor
      }
    }
  });

  //TODO: fix a bug in textarea submit/cancel methods
  prompt._.input.cancel = function() {
    infoWrapper.content = `log: event handler called`;
    screen.render();
    this.clearValue();
    this.prototype.cancel();
  };

  prompt.readInput('Enter a note to add', '', err => {
    if (err != undefined) {
      /* Error occured */
      infoWrapper.content = `error occured: ${err.message.toLowerCase()}`;
      prompt.destroy();
      screen.render();
    } else if (
      prompt._.input.value != undefined &&
      prompt._.input.value !== ''
    ) {
      /* Confirmed */
      const text = prompt._.input.value;
      notes.add(text, noteWrapper.selectedIndex);
      noteWrapper.setItems(
        notes.toArray().map((entry, index) => `${index + 1}) ${entry}`)
      );
      noteWrapper.focus();
      prompt.destroy();
      infoWrapper.content = 'done! c:';
      screen.render();
    } else {
      /* Cancelled */
      prompt.destroy();
      infoWrapper.content = 'cancelled';
      screen.render();
    }
  });
}

/**
 * Function saves notes to the file
 */
function saveNotes(completion: ?string) {
  infoWrapper.content = 'saving changes...';
  screen.render();
  notes.serialize(notesFile);
  if (completion != undefined) {
    infoWrapper.content = completion;
    screen.render();
  }
}

/**
 * Function deletes the highlighted note
 */
function deleteNote() {
  let prompt = blessed.question({
    parent: screen,
    top: 'center',
    left: 'center',
    width: 22,
    height: 5,
    draggable: true,
    border: {
      type: theme.border ? 'line' : 'none'
    },
    inputOnFocus: true,
    style: {
      fg: theme.textColor,
      bg: theme.backgroundColor,
      border: {
        fg: theme.borderColor
      }
    }
  });
  prompt.ask('Delete the note?', (err, res) => {
    if (err != undefined) {
      /* Error occured */
      infoWrapper.content = `error occured: ${err.message.toLowerCase()}`;
      prompt.destroy();
      screen.render();
    } else if (res) {
      /* Confirmed */
      try {
        prompt.destroy();
        infoWrapper.content = `deleting note #${noteWrapper.selectedIndex + 1}`;
        screen.render();
        notes.delete(noteWrapper.selectedIndex);
        noteWrapper.setItems(
          notes.toArray().map((entry, index) => `${index + 1}) ${entry}`)
        );
        noteWrapper.selectedIndex =
          noteWrapper.selectedIndex === notes.count()
            ? Math.max(noteWrapper.selectedIndex - 1, 0)
            : noteWrapper.selectedIndex;
        infoWrapper.content = 'done! c:';
        screen.render();
      } catch (err) {
        if (err instanceof ArgumentError) {
          infoWrapper.content = err.message;
          screen.render();
        } else {
          throw err;
        }
      }
    } else {
      /* Cancelled */
      prompt.destroy();
      screen.render();
    }
  });
}

/**
 * Function clears the note list
 */
function clearNotes() {
  let prompt = blessed.question({
    parent: screen,
    top: 'center',
    left: 'center',
    width: 51,
    height: 5,
    draggable: true,
    border: {
      type: theme.border ? 'line' : 'none'
    },
    inputOnFocus: true,
    style: {
      fg: theme.textColor,
      bg: theme.backgroundColor,
      border: {
        fg: theme.borderColor
      }
    }
  });
  prompt.ask('Are you sure you want to delete all your notes?', (err, res) => {
    if (err != undefined) {
      /* Error occured */
      infoWrapper.content = `error occured: ${err.message.toLowerCase()}`;
      prompt.destroy();
      screen.render();
    } else if (res) {
      /* Confirmed */
      notes.clear();
      noteWrapper.setItems(
        notes.toArray().map((entry, index) => `${index + 1}) ${entry}`)
      );
      prompt.destroy();
      infoWrapper.content = 'done! c:';
      infoWrapper.content = `> selected index: ${noteWrapper.selectedIndex}`; //DEBUG: delete log
      screen.render();
    } else {
      /* Cancelled */
      prompt.destroy();
      screen.render();
    }
  });
}

/**
 * Function moves a note following the cursor
 */
function moveNote() {
  let lastPosition = noteWrapper.selectedIndex;
  function listener(ch, key) {
    if (
      key.name === 'k' ||
      key.name === 'j' ||
      key.name === 'up' ||
      key.name === 'down'
    ) {
      let currentPosition = noteWrapper.selectedIndex;
      notes.swap(currentPosition, lastPosition);
      lastPosition = currentPosition;
      noteWrapper.setItems(
        notes.toArray().map((entry, index) => `${index + 1}) ${entry}`)
      );
      screen.render();
    }
  }

  if (noteWrapper.moving === true) {
    /* Stop moving */
    noteWrapper.moving = false;
    noteWrapper.style.selected.bg = theme.focusColor;
    noteWrapper.removeListener('keypress', listener);
    screen.render();
  } else {
    /* Start moving */
    noteWrapper.moving = true;
    noteWrapper.style.selected.bg = theme.selectedColor;
    infoWrapper.content = `moving a note... press 'M' again to cancel`;
    noteWrapper.focus();
    screen.render();
    lastPosition = noteWrapper.selectedIndex;
    noteWrapper.on('keypress', listener);
  }
}

/* Hook up event handlers */
screen.on('resize', () => {
  setupScreen();
});
screen.key(['d'], () => {
  deleteNote();
});
screen.key(['a'], () => {
  addNote();
});
screen.key(['m'], () => {
  moveNote();
});
screen.key(['c'], () => {
  clearNotes();
});
screen.key(['s'], () => {
  saveNotes('done! c:');
});
screen.key(['q', 'C-c'], () => {
  saveNotes();
  blessed.program().clear();
  process.exit(0);
});

/* Render the screen */
screen.render();
