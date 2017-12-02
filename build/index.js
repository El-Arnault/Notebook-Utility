#!/usr/bin/env node
"use strict";

var _notelist = require("./notelist.js");

var _notelist2 = _interopRequireDefault(_notelist);

var _argError = require("./arg-error.js");

var _argError2 = _interopRequireDefault(_argError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Function prints manual */


/**
 * Main script for CLI.
 */

/* Export modules */
function printManual() {
    console.log("Options:\n");
    console.log("-a --add    [entry]  Add a note");
    console.log("-d --delete [index]  Delete a note with the given index");
    console.log("-p --print           Print the list of notes");
    console.log("-c --clear           Clear the list");
}

/* Initialize note list */
var file = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.notes.json";
var note = _notelist2.default.fromFile(file);
var command = process.argv[2];
var extra = process.argv.slice(3);
try {
    /* Process arguments */
    if (command == undefined) {
        console.log("Call \"notes -h\" to get information about the program");
    } else {
        switch (command) {
            case "-a":case "--add":
                /* Add each non-empty note to the note tracker */
                extra.forEach(function (entry) {
                    if (entry !== "") {
                        note.add(entry);
                    }
                });
                note.serialize(file);
                /* Successful termination message */
                console.log("Done c:");
                break;
            case "-d":case "--delete":
                /* Delete note from the note tracker */
                var index = Number(extra[0]);
                if (!Number.isInteger(index)) {
                    throw new _argError2.default("Argument for delete must be a number");
                }
                note.delete(index);
                note.serialize(file);
                /* Successful termination message */
                console.log("Done c:");
                break;
            /* Print notes */
            case "-p":case "--print":
                console.log("My Notebook");
                console.log("---------------------------");
                console.log(note.print());
                console.log("---------------------------");
                break;
            /* Clear note list */
            case "-c":case "--clear":
                note.clear();
                note.serialize(file);
                /* Successful termination message */
                console.log("Done c:");
                break;
            /* Show help message */
            case "-h":case "--help":
                printManual();
                break;
            /* Unknown argument */
            default:
                throw new _argError2.default("Invalid option passed :c Refer to \"-h\" or \"--help\" for help.");
        }
    }
} catch (err) {
    /* Handle known errors */
    if (err instanceof _argError2.default) {
        console.error(err.message);
    } else {
        throw err;
    }
}