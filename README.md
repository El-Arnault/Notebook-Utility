# Notebook Utility

## Description

Simplistic note tracker with text-based user interface based on JavaScript and Node.js.

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

The screen area is split into three zones. The top left area is where your notes will be shown. The are on the right shows all you need to know in order to interact with the note tracker.

Along with arrow keys you can use vi-style **K** and **J** keys to navigate through the list.
Below you'll find the table of all shortcuts and what they do:

 Shortcut   | Description
------------|----------------------------
**K** / **J** | Move curson one entry up/down.
**M**       | Enter an interactive mode where you'll be able to move the highlighted note up/down to arrange your notes.
**D**       | Delete the currently highlighted note.
**C**       | Clear the note tracker.
**A**       | Add a new note at the current position.
**S**       | Save changes.
**Q**       | Save changes and quit.

**_Note:_** Currently, there is a known problem that causes clicking "Cancel" while adding a new note add the note nonetheless if the input field was not empty. It comes upstream but be sure we are working on fixing it.

## Theme

Notebook utility supports simple themes. Theme is specified in JSON format and is stored in **assets/theme.json** file. Below is the table of all options and what they do. All color values can be specified as `'default'` for the default color, as a color name (for example, `'red'`), or as a hex value.

 Property       | Description
----------------|-----------------
border          | `true` to show border, `false` otherwise
borderColor     | Border color
backgroundColor | Background color
focusColor      | Highlight color for notes
selectedColor   | Highlight color while moving notes
textColor       | Text color
scrollbarColor  | Main color for the scrollbar mark
scrollbarBGColor| Background color for the scrollbar mark
scrollbarMarker | Scrollbar mark to display current position, can be any symbol


## License
Software is available under the terms of the MIT License.