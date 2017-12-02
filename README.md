# Notebook Utility

## Description

Simplistic note tracker with command line interface based on JavaScript and Node.js.

Hope you will enjoy using it!

## Installation

In order to install the command line interface make sure both Node.js and npm are installed by typing the following commands on your command line:

```bash
npm -v
node -v
```

The command below will install the note tracker globall, so you could access your notes from any place in your system:

```bash
npm install -g notebook-utility
```

## Usage

Notebook utility can be invoked with the following command:

```bash
notes
```

Help can be invoked with:

```bash
notes --help
```

Below is the list of all options that notebook utility takes.

Option          | Arguments   | Description
--------------- | ----------- | -----------------------------------
`-a` `--add`    | `[entry]`   | Add a note
`-d` `--delete` | `[index]`   | Delete a note at the passed index
`-p` `--print`  |             | Print the notebook contents
`-c` `--clear`  |             | Clear the notebook
`-h` `--help`   |             | Print the list of options

# Examples

Add a note:

```bash
notes --add "Hello world"
```

Optionally, you can add several notes at once:

```bash
notes --add "The weather is nice today" "Go for a walk" "Make some coffee"
```

List all existing notes:

```bash 
notes --print
```

Delete note number two:

```bash
notes --delete 2
```

Clear the note tracker:

```bash
notes --clear
```

*__Warning:__* This will delete all your notes, so be careful!


## License
Software is available under the terms of the MIT License.