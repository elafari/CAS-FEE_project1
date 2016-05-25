
/**
 * This file provides all helper functionality for the note project.
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

var helper = {
	
	noteShelf : [],
	noteShelfRecord : [],

	noteCounter : 0,
	
	fileName : ".\\documents\\noteShelf.json",
	
	noteDateFormat : "YYYYMMDDHHmmss",
	
	noteDateFormatOut01: "YYYY-MM-DD-HH-mm-ss",
	noteDateFormatOut02: "dddd-WW",
	
	logTarget : "C",
	logLevel : {
		info : "[INFO] ",
		error : "[ERROR] "
	},
	logInfo : true,

	/**
  * Check POST parameters
  * 
  */
	checkPostParams : function(reqBody,update) {
		
		var checkOK = false;
		if (update) {
			helper.logger(helper.logLevel.info,"--> Update");
			if (reqBody.noteid && reqBody.title && reqBody.text && reqBody.importance ) {
				checkOK = true;
			}
		} else {
			helper.logger(helper.logLevel.info,"--> Add: " + reqBody.title);
			if (reqBody.title && reqBody.text && reqBody.importance ) {
				checkOK = true;
			}
		}
		if (checkOK == false) {
			helper.logger(helper.logLevel.info,"Es fehlt mindestens ein Attribut zur Notiz!");
		}
		return checkOK;
	},
	
	/**
  * Add a note to noteShelf
  * @param {Object} noteAttrib request body object
  */
	addNote : function(noteAttrib, updateFlag) {
		try {
			var updateFlag = updateFlag || false;
			
			// count up before calling fillNote!
			helper.noteCounter = helper.getNoteID() + 1;

			var note = helper.fillNote(noteAttrib, updateFlag);
			helper.noteShelf.push(note);
			
			helper.saveNotes();
			
			helper.logger(helper.logLevel.info,"Hinzugefügt: noteCounter= " + helper.noteCounter);

		} catch(e) {
			helper.logger(helper.logLevel.error,"helper addNote: " + e);
		}
	},

	/**
  * Fill note record.
  * @param {Object} noteAttrib request body object
  */
	fillNote : function(noteAttrib, updateFlag) {
		try {
			
			var note = {};
				
			if (updateFlag == true) {
				note.noteid = noteAttrib.noteid;
			} else {
				// counter was counted up in addNote
				note.noteid = helper.noteCounter;
			}
			
			// note attributes
			note.guid = helper.createGUID();
			helper.logger(helper.logLevel.info,"GUID: " + helper.createGUID());
			
			note.title = noteAttrib.title;
			note.text = noteAttrib.author;
			note.importance = noteAttrib.importance;
			
			note.datecreate = helper.getFormattedDate();			// = noteAttrib.datecreate;
			note.datefinished = helper.getFormattedDate();		// = noteAttrib.datefinished;
			note.datetarget = helper.getFormattedDate();			// = noteAttrib.datetarget;
			//
	
			return note;
		} catch(e) {
			helper.logger(helper.logLevel.error,"helper fillNote: " + e);
		}
	},

	/**
  * Delete note.
  * @param {Number} entryID note id which is to be deleted
  */
	deleteNote : function(entryID) {
		try {
			if (entryID) {
				helper.noteShelf.splice(entryID,1);
				
				helper.saveNotes();
				
				helper.logger(helper.logLevel.info,"Gelöscht: entryID=" + entryID + " noteCounter= " + helper.noteCounter);
			} else {
				helper.logger(helper.logLevel.info,"entryID=" + entryID + " nicht in Notizensammlung vorhanden");
			}
		} catch (e) {
			helper.logger(helper.logLevel.error,"helper deleteNote: " + e);
		}
	},
	
	/**
  * Update note.
  * @param {Object} noteAttrib request body object
  */
	updateNote : function(noteAttrib) {
		try {
			var noteID = noteAttrib.noteid;
			helper.logger(helper.logLevel.info,"Update: noteID=" + noteID);
			// delete note
			var entryID = helper.checkNotes(noteID);
			helper.deleteNote(entryID);
			// add note with same noteid and updated data
			helper.addNote(noteAttrib,true);
		} catch (e) {
			helper.logger(helper.logLevel.error,"helper deleteNote: " + e);
		}
	},
	
	/**
  * Get whole noteShelf, or one record of noteShelf.
  * @param {Number} entryID array record which has to be deleted
	* @return {Object} noteShelf object or one noteSelf record
  */
	getNoteShelf : function(entryID) {
		try {
			if (entryID || entryID == 0) {
	
				// log formatted date
				helper.logFormattedDate(entryID);

				var oneRecordArray = [];
				oneRecordArray.push(helper.noteShelf[entryID]);
				
				return oneRecordArray;

			} else {
				
				return helper.noteShelf;
				
			}
		} catch(e) {
			helper.logger(helper.logLevel.error,"helper getNoteShelf: " + e);			
		}
	},
	
	/**
  * Reset noteShelf to blank array.
  */
	resetNoteShelf : function() { 
		try {
			helper.noteShelf = [];	
			helper.noteCounter = -1;
		} catch(e) {
			helper.logger(helper.logLevel.error,"helper resetNoteShelf: " + e);	
		}
	},

	/**
  * Load notes from file to noteShelf object.
 	* @return {Boolean} False if an error occoured, true if not.
  */	
	loadNotes: function() {
		try {
			helper.logger(helper.logLevel.info,"loadNotes from: " + helper.fileName + " in helper.noteShelf[]");
			helper.noteShelf = JSON.parse(fs.readFileSync(helper.fileName));
			
			helper.noteCounter = helper.getNoteID();
			
			helper.logger(helper.logLevel.info,"Load Notes: noteCounter= " + helper.noteCounter);
			return true;
		} catch(e) {
			helper.logger(helper.logLevel.error,"helper loadNotes: " + e);
			return false;
		}
	},

	/**
  * Save notes to a file.
 	* @return {Boolean} False if an error occoured, true if not.
  */		
	saveNotes: function() {
		try {
			helper.logger(helper.logLevel.info,"saveNotes to: " + helper.fileName );
			fs.writeFileSync(helper.fileName, JSON.stringify(helper.noteShelf,null,2));
			return true;
		} catch(e) {
			helper.logger(helper.logLevel.error,"helper saveNotes: " + e);	
			return false;
		}
	},

	/**
  * Check the presence of a note in the noteShelf.
 	* @return {Number} Note id or -1.
  */		
	checkNotes : function(checkID) {
		try {
			helper.logger(helper.logLevel.info,"Anzahl notes: " + helper.noteShelf.length);
			var found = -1;
			for (var i = 0, counter = helper.noteShelf.length; i < counter; i++) {
				helper.logger(helper.logLevel.info,"i=" + i + " - noteid=" + helper.noteShelf[i].noteid + " - checkID=" + checkID);
				if (helper.noteShelf[i].noteid == checkID) {
					helper.logger(helper.logLevel.info,"yes");
					return i;
				} else {
					helper.logger(helper.logLevel.info,"no");
				}
			}
			return found;
		} catch(e) {
			helper.logger(helper.logLevel.error,"helper checkNotes: " + e);
		}
	},

	/**
  * Get highest noteid in noteShelf.
 	* @return {Number} Note id or -1.
  */		
	getNoteID : function() {
		try {
			var found = -1;
			for (var i = 0, counter = helper.noteShelf.length; i < counter; i++) {
				if (helper.noteShelf[i].noteid > found) {
					found = helper.noteShelf[i].noteid;
				}
			}
			return found;
		} catch(e) {
			helper.logger(helper.logLevel.error,"helper getNoteId: " + e);
		}
	},
	
	/**
  * Get formatted date
  */
	getFormattedDate : function() {
		
		var now = moment(new Date());
		
		var formattedDate = now.format(helper.noteDateFormat);
		
		return formattedDate;
	},

	/**
  * Log some variants of date formatted by moment.js
  */
	logFormattedDate : function(entryID) {
	
		var testDate = helper.noteShelf[entryID].datecreate;
		var testDateFormatted = moment(testDate,helper.noteDateFormat).format(helper.noteDateFormatOut01)
	
		helper.logger(helper.logLevel.info,"date: " + testDate);
		
		helper.logger(helper.logLevel.info,"moment-format: Datum Uhrzeit: " + testDateFormatted);
		helper.logger(helper.logLevel.info,"moment-format: Wochentag-KW: " + moment(testDate,helper.noteDateFormat).format(helper.noteDateFormatOut02));
		
		var now = moment();
		var nowFormatted = moment(now,helper.noteDateFormat).format(helper.noteDateFormatOut01);
		helper.logger(helper.logLevel.info,"date: " + moment(now,helper.noteDateFormat).format(helper.noteDateFormatOut01));
		helper.logger(helper.logLevel.info,"moment-format: " + testDateFormatted + " - " + nowFormatted + " -- "+ now.diff(testDate, 'day') + " days");
		helper.logger(helper.logLevel.info,"moment-format: " + testDateFormatted + " - " + nowFormatted + " -- "+ now.diff(testDate, 'minute') + " minute");
						
	},

	/**
  * Create GUID
  */	
	createGUID : function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
			});
	},
	
	/**
  * Logger method.
  */		
	logger : function(level, text) {
		
		if (helper.logTarget == "C") {					// console
			if ((helper.logInfo && level == helper.logLevel.info) || level == helper.logLevel.error) {
				console.log(level + text);
			}
		} else if (helper.logTarget == "D") {		// database
			// todo
		}
		
	},

	/**
  * Toggle logtype on/off.
	* @return {Boolean} toggled logtype.
  */			
	toggleLogInfo : function() {
		helper.logInfo = !helper.logInfo;
		return helper.logInfo;
	}
	
}

module.exports = {
	
	checkPostParams : helper.checkPostParams,
	
	checkNotes : helper.checkNotes,
	addNote : helper.addNote,
	deleteNote : helper.deleteNote,
	updateNote : helper.updateNote,
	
	getNoteShelf : helper.getNoteShelf,
	resetNoteShelf : helper.resetNoteShelf,
	
	toggleLogInfo : helper.toggleLogInfo,
	
	createGUID : helper.createGUID,
	
	logger : helper.logger,
	logLevel : helper.logLevel,
	
	loadNotes : helper.loadNotes,
	saveNotes : helper.saveNotes,
	
}