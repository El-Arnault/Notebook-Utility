#!/usr/bin/env node
/*       */

/**
 * Main script for CLI.
 */

/* Export modules */
const NoteList = require("./notelist.js");
const ArgumentError = require("./arg-error.js");

/* Function prints manual */
function print_man() {
    console.log("Options:\n");
    console.log("-a --add    [entry]  Add a note");
    console.log("-d --delete [index]  Delete a note with the given index");
    console.log("-p --print           Print the list of notes");
    console.log("-c --clear           Clear the list");
}

/* Initialize note list */
let note = new NoteList();
let command = process.argv[2];
let extra = process.argv.slice(3);
try {
    /* Process arguments */
    if (command == undefined) {
        console.log("Call \"notes\" with -h or --help to get information about all available options");
    } else {
        switch(command) {
            /* Add note */
            case "-a": case "--add":
                let entry = extra.reduce(function(prev, current, index) {
                    return index == 0 ? current : prev + " " + current;
                }, "");
                note.add(entry);
                note.serialize();
                /* Successful termination message */
                console.log("Done c:");
                break;
            /* Delete note */
            case "-d": case "--delete":
                let index = Number(extra[0]);
                if (!Number.isInteger(index)) {
                    throw new ArgumentError("Argument for delete must be a number");
                }
                note.delete(index);
                note.serialize();
                /* Successful termination message */
                console.log("Done c:");
                break;
            /* Print notes */
            case "-p": case "--print":
                note.print();
                break;
            /* Clear note list */
            case "-c": case "--clear":
                note.clear();
                note.serialize();
                /* Successful termination message */
                console.log("Done c:");
                break;
            /* Show help message */
            case "-h": case "--help":
                print_man();
                break;
            /* Unknown argument */
            default:
                throw new ArgumentError("Invalid option passed :c Please, call with \"-h\" or \"--help\" for help.");
        }
    }
} catch(err) {
    /* Handle known errors */
    if (err instanceof ArgumentError) {
        console.error(err.message);
    } else {
        throw err;
    }
}