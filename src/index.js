#!/usr/bin/env node
/* @flow */

/**
 * Main script for CLI.
 */

/* Export modules */
import NoteList from "./notelist.js";
import ArgumentError from "./arg-error.js";

/* Function prints manual */
function printManual() {
    console.log("Options:\n");
    console.log("-a --add    [entry]  Add a note");
    console.log("-d --delete [index]  Delete a note with the given index");
    console.log("-p --print           Print the list of notes");
    console.log("-c --clear           Clear the list");
}

/* Initialize note list */
const file = "data.json";
let note = NoteList.fromFile(file);
let command = process.argv[2];
let extra = process.argv.slice(3);
try {
    /* Process arguments */
    if (command == undefined) {
        console.log("Call \"notes -h\" to get information about the program");
    } else {
        switch(command) {
            case "-a": case "--add":
                /* Add note to the note tracker */
                let entry = extra.reduce(function(prev, current, index) {
                    return index == 0 ? current : prev + " " + current;
                }, "");
                note.add(entry);
                note.serialize(file);
                /* Successful termination message */
                console.log("Done c:");
                break;
            case "-d": case "--delete":
                /* Delete note from the note tracker */
                let index = Number(extra[0]);
                if (!Number.isInteger(index)) {
                    throw new ArgumentError("Argument for delete must be a number");
                }
                note.delete(index);
                note.serialize(file);
                /* Successful termination message */
                console.log("Done c:");
                break;
            /* Print notes */
            case "-p": case "--print":
                console.log("My Notebook");
                console.log("---------------------------");
                console.log(note.print());
                console.log("---------------------------");
                break;
            /* Clear note list */
            case "-c": case "--clear":
                note.clear();
                note.serialize(file);
                /* Successful termination message */
                console.log("Done c:");
                break;
            /* Show help message */
            case "-h": case "--help":
                printManual();
                break;
            /* Unknown argument */
            default:
                throw new ArgumentError("Invalid option passed :c Refer to \"-h\" or \"--help\" for help.");
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