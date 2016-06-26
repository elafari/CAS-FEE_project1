/**
 * This file provides all custom functionality for the note project.
 *
 * @version 1.0
 *
 * @requires fs
 * @requires path
 * @requires moment
 *
 */

var fs = require('fs');
var path = require('path');
var moment = require('moment');

var custom = {

    noteShelf: [],

    noteCounter: 0,

    noteDefault: {
        "id": 0,
        "guid": "0",
        "title": "",
        "description": "",
        "prio": "1",
        "dateCreated": "0",
        "dateFinished": "0",
        "dueDate": "0"
    },

    fileName: ".\\documents\\noteShelf.json",

    noteDateFormat: "YYYYMMDDHHmmss",

    noteDateFormatOut01: "YYYY-MM-DD-HH-mm-ss",
    noteDateFormatOut02: "dddd-WW",

    logTarget: "C",
    logLevel: {
        info: "[INFO] ",
        error: "[ERROR] "
    },
    logInfo: true,

    /**
     * Check POST parameters completeness
     * @param {Object} reqBody request body object
     * @param {Boolean} update update flag
     */
    checkPostParams: function (reqBody, update) {

        var checkOK = false;
        if (update) {
            custom.logger(custom.logLevel.info, "--> Update");
            if (reqBody.id) {
                checkOK = true;
            }
        } else {
            custom.logger(custom.logLevel.info, "--> Add: " + reqBody.title);
            if (reqBody.title && reqBody.description && reqBody.prio) {
                checkOK = true;
            }
        }
        if (checkOK == false) {
            custom.logger(custom.logLevel.info, "At least one attribute is missing!");
        }
        return checkOK;
    },

    /**
     * Add a note to noteShelf
     * @param {Object} noteAttrib request body object
     */
    addNote: function (noteAttrib, updateFlag, noteRemain) {
        try {
            updateFlag = updateFlag || false;
            noteRemain = noteRemain || custom.noteDefault;
            custom.logger(custom.logLevel.info, "Before: " + noteRemain);

            var note = custom.fillNote(noteAttrib, updateFlag, noteRemain);

            custom.noteShelf.push(note);
            custom.saveNotes();
            custom.logger(custom.logLevel.info, "Processed: noteCounter= " + note.id);

            // return relevant note data
            return [{
                "id": Number(note.id),
                "dateCreated": note.dateCreated,
                "dateFinished": note.dateFinished
            }];

        } catch (e) {
            custom.logger(custom.logLevel.error, "custom addNote: " + e);
        }
    },

    /**
     * Fill note record.
     * @param {Object} noteAttrib request body object
     */
    fillNote: function (noteAttrib, updateFlag, noteRemain) {
        try {

            var note = {};

            // fill note attributes depending of add/update
            if (updateFlag === true) {
                note.id = noteAttrib.id;
                note.dateCreated = noteRemain.dateCreated
                if (noteAttrib.dateFinished) {
                    if (noteAttrib.dateFinished === "0") {
                        note.dateFinished = noteAttrib.dateFinished;
                    } else {
                        note.dateFinished = custom.getFormattedDate();
                    }
                } else {
                    note.dateFinished = noteRemain.dateFinished;
                }
            } else {
                custom.noteCounter = parseInt(custom.getNoteID()) + 1;
                note.id = custom.noteCounter;
                note.dateCreated = custom.getFormattedDate();
            }

            // fill other note attributes
            note.guid = custom.createGUID();
            note.title = noteAttrib.title || noteRemain.title;
            note.description = noteAttrib.description || noteRemain.description;
            note.prio = noteAttrib.prio || noteRemain.prio;
            note.dueDate = noteAttrib.dueDate || noteRemain.dueDate;

            return note;
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom fillNote: " + e);
        }
    },

    /**
     * Delete note.
     * @param {Number} entryID note id which is to be deleted
     */
    deleteNote: function (entryID) {
        try {
            if (entryID !== -1) {
                var noteDeleted = custom.noteShelf[entryID];
                custom.noteShelf.splice(entryID, 1);
                custom.saveNotes();
                custom.logger(custom.logLevel.info, "Deleted: entryID=" + entryID + " noteCounter= " + noteDeleted.id);
                return noteDeleted;
            } else {
                custom.logger(custom.logLevel.info, "entryID=" + entryID + " not found");
                return null;
            }
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom deleteNote: " + e);
            return null;
        }
    },

    /**
     * Update note.
     * @param {Object} noteAttrib request body object
     */
    updateNote: function (noteAttrib) {
        try {
            var noteID = noteAttrib.id;

            custom.logger(custom.logLevel.info, "Update: noteID=" + noteID);
            var entryID = custom.checkNotes(noteID);

            if (entryID !== -1) {
                // delete note
                var noteDeleted = custom.deleteNote(entryID);

                // add note with same noteid and updated data
                var noteAdded = custom.addNote(noteAttrib, true, noteDeleted);

                noteAdded[0]._action = 'updated';
                // return relevant note data
                return noteAdded;
            }
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom updateNote: " + e);
        }
    },

    /**
     * Get whole noteShelf, or one record of noteShelf.
     * @param {Number} entryID array record which has been requested
     * @return {Object} noteShelf object or one noteSelf record
     */
    getNoteShelf: function (entryID) {
        try {
            if (entryID || entryID == 0) {

                // log formatted date
                custom.logFormattedDate(entryID);

                var oneRecordArray = [];
                oneRecordArray.push(custom.noteShelf[entryID]);

                return oneRecordArray;
            } else {
                return custom.noteShelf;
            }
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom getNoteShelf: " + e);
        }
    },

    /**
     * Reset noteShelf to blank array.
     */
    resetNoteShelf: function () {
        try {
            custom.noteShelf = [];
            custom.noteCounter = -1;
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom resetNoteShelf: " + e);
        }
    },

    /**
     * Load notes from file to noteShelf object.
     * @return {Boolean} False if an error occoured, true if not.
     */
    loadNotes: function () {
        try {
            custom.logger(custom.logLevel.info, "loadNotes from: " + custom.fileName + " in custom.noteShelf[]");
            custom.noteShelf = JSON.parse(fs.readFileSync(custom.fileName));

            custom.noteCounter = custom.getNoteID();

            custom.logger(custom.logLevel.info, "Load Notes: noteCounter= " + custom.noteCounter);
            return true;
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom loadNotes: " + e);
            return false;
        }
    },

    /**
     * Save notes to a file.
     * @return {Boolean} False if an error occoured, true if not.
     */
    saveNotes: function () {
        try {
            custom.logger(custom.logLevel.info, "saveNotes to: " + custom.fileName);
            fs.writeFileSync(custom.fileName, JSON.stringify(custom.noteShelf, null, 2));
            return true;
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom saveNotes: " + e);
            return false;
        }
    },

    /**
     * Check the presence of a note in the noteShelf.
     * @return {Number} Note id or -1.
     */
    checkNotes: function (checkID) {
        try {
            custom.logger(custom.logLevel.info, "Anzahl notes: " + custom.noteShelf.length);
            var found = -1;
            for (var i = 0, counter = custom.noteShelf.length; i < counter; i++) {
                custom.logger(custom.logLevel.info, "i=" + i + " - id=" + custom.noteShelf[i].id + " - checkID=" + checkID);
                if (custom.noteShelf[i].id === checkID) {
                    custom.logger(custom.logLevel.info, "yes");
                    return i;
                } else {
                    custom.logger(custom.logLevel.info, "no");
                }
            }
            return found;
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom checkNotes: " + e);
        }
    },

    /**
     * Get highest note id in noteShelf.
     * @return {Number} Note id or -1.
     */
    getNoteID: function () {
        try {
            var found = -1;
            for (var i = 0, counter = custom.noteShelf.length; i < counter; i++) {
                if (custom.noteShelf[i].id > found) {
                    found = custom.noteShelf[i].id;
                }
            }
            return found;
        } catch (e) {
            custom.logger(custom.logLevel.error, "custom getNoteId: " + e);
        }
    },

    /**
     * Get formatted date
     */
    getFormattedDate: function () {

        var now = moment(new Date());

        var formattedDate = now.format(custom.noteDateFormat);

        return formattedDate;
    },

    /**
     * Log some variants of date formatted by moment.js
     */
    logFormattedDate: function (entryID) {

        var testDate = custom.noteShelf[entryID].dateCreated;
        var testDateFormatted = moment(testDate, custom.noteDateFormat).format(custom.noteDateFormatOut01)

        custom.logger(custom.logLevel.info, "date: " + testDate);

        custom.logger(custom.logLevel.info, "moment-format: Datum Uhrzeit: " + testDateFormatted);
        custom.logger(custom.logLevel.info, "moment-format: Wochentag-KW: " + moment(testDate, custom.noteDateFormat).format(custom.noteDateFormatOut02));

        var now = moment();
        var nowFormatted = moment(now, custom.noteDateFormat).format(custom.noteDateFormatOut01);
        custom.logger(custom.logLevel.info, "date: " + moment(now, custom.noteDateFormat).format(custom.noteDateFormatOut01));
        custom.logger(custom.logLevel.info, "moment-format: " + testDateFormatted + " - " + nowFormatted + " -- " + now.diff(testDate, 'day') + " days");
        custom.logger(custom.logLevel.info, "moment-format: " + testDateFormatted + " - " + nowFormatted + " -- " + now.diff(testDate, 'minute') + " minute");

    },

    /**
     * Create GUID
     */
    createGUID: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * Logger method.
     */
    logger: function (level, text) {

        if (custom.logTarget == "C") {					// console
            if ((custom.logInfo && level == custom.logLevel.info) || level == custom.logLevel.error) {
                console.log(level + text);
            }
        } else if (custom.logTarget == "D") {			// database
            // @todo
        }
    },

    /**
     * Toggle logtype on/off.
     * @return {Boolean} toggled logtype.
     */
    toggleLogInfo: function () {
        custom.logInfo = !custom.logInfo;
        return custom.logInfo;
    }

}

module.exports = {

    checkPostParams: custom.checkPostParams,

    checkNotes: custom.checkNotes,
    addNote: custom.addNote,
    deleteNote: custom.deleteNote,
    updateNote: custom.updateNote,

    getNoteShelf: custom.getNoteShelf,
    resetNoteShelf: custom.resetNoteShelf,

    toggleLogInfo: custom.toggleLogInfo,

    createGUID: custom.createGUID,

    logger: custom.logger,
    logLevel: custom.logLevel,

    loadNotes: custom.loadNotes,
    saveNotes: custom.saveNotes

}