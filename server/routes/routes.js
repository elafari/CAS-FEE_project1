
/**
 * This file provides all routes for the note project.
 *
 * @version 1.0
 *
 * @requires custom/custom.js
 *
 */

var custom = require("../custom/custom.js");

var ourAppRouter = function(app) {

	/**
	* Route for toggling log level.
	*/
	app.get("/toggleLogInfo", function(req, res) {
		try {
			var currentLogInfo = custom.toggleLogInfo();
			res.send("New log info flag: " + currentLogInfo);
		} catch(e) {
			custom.logger(custom.logLevel.error,"route get /toggleLogInfo: " + e);
		}
	});
	/**
	* Route to load notes from JSON file.
	*/
	app.get("/loadNotes", function(req, res) {
		try {
			var retValue = custom.loadNotes();
			if (retValue == true) {
				custom.logger(custom.logLevel.info,"loadFile - retValue: " + retValue);
				res.send("File loaded .. ");				
			} else {
				res.send("File load error!")
			}

		} catch (e) {
			custom.logger(custom.logLevel.error,"route get /loadFile: "+ e);
			custom.noteShelf = [];
		}
	});
	/**
	* Route to save notes to JSON file.
	*/
	app.get("/saveNotes", function(req, res) {
		try {
			var retValue = custom.saveNotes();
			if (retValue == true) {
				custom.logger(custom.logLevel.info,"saveFile - retValue: " + retValue);
				res.send("File saved .. ");
			} else {
				res.send("File save error!");
			}
		} catch (e) {
			custom.logger(custom.logLevel.error,"route get /saveFile: "+ e);
			custom.noteShelf = [];
		}
	});
	/**
	* Route to get a note with note id.
	*/
	app.get("/notebook", function(req, res) {

		try {
			var checkedID = custom.checkNotes(req.query.id);

			if (!req.query.id) {
				return res.send({"status": "error", "message": "route get /notebook: no ID"});
			} else if (checkedID == -1) {
				return res.send({"status": "error", "message": "route get /notebook: unknown ID"});
			} else {
				return res.send(custom.getNoteShelf(checkedID));
			}
		} catch(e) {
			custom.logger(custom.logLevel.error,"route get /notebook: " + e);
		}
	});
	/**
	* Route to get all note.
	*/
	app.get("/notebookall", function(req, res) {
		
		try {
			custom.logger(custom.logLevel.info,"Zeige alle");
			return res.send(custom.getNoteShelf());
		} catch(e) {
			custom.logger(custom.logLevel.error,"route get /notebookall: " + e);
		}
	});
	/**
	* Route posting data to add or update notes.
	*/
	app.post("/notebook", function(req, res) {
		try {
			if (!req.body.id) {
				custom.logger(custom.logLevel.info,"app.post: add");
				// add note
				if (custom.checkPostParams(req.body)) {
					var noteAdded = custom.addNote(req.body);

					// if flag getAll is set, then return whole note array
					if (req.body.getAll) {
						return res.send(custom.getNoteShelf());
					} else {
						return res.send([{"id": "" + noteAdded}]);
					}
				} else {
					return res.send({"status": "error", "message": "route post /notebook: At least one attribute is missing!"});
				}
			} else {
				var checkedID = custom.checkNotes(req.body.id);
			}
			if (checkedID == -1) {
				custom.logger(custom.logLevel.error,"route get /notebookUpdate: unknown ID");
				return res.send({"status": "error", "message": "route get /notebookUpdate: unknown ID"});
			} else {
				custom.logger(custom.logLevel.info,"app.post: update");
				if (custom.checkPostParams(req.body,true)) {
					var noteUpdated = custom.updateNote(req.body);

					// if flag getAll is set, then return whole note array
					if (req.body.getAll) {
						return res.send(custom.getNoteShelf());
					} else {
						return res.send([{"id": "" + noteUpdated}]);
					}
				} else {
					return res.send({"status": "error", "message": "route get /notebookUpdate: At least one attribute is missing!"});
				}
			}
		} catch(e) {
			custom.logger(custom.logLevel.error,"route post /notebook: " + e);
			return res.send([{"id": "error"}]);
		}
	});
	/**
	* Route to delete a note by id.
	*/
	app.post("/notebookDelete", function(req, res) {

		console.log(req.body);
		try {
			if (!req.body.id) {
				custom.logger(custom.logLevel.error,"route get /notebookDelete: no ID");
				return res.send({"status": "error", "message": "route get /notebookDelete: no ID"});
			} else {
				var checkedID = custom.checkNotes(req.body.id);
			}
			if (checkedID == -1) {
				custom.logger(custom.logLevel.error,"route get /notebookDelete: unknown ID");
				return res.send({"status": "error", "message": "route get /notebookDelete: unknown ID"});
			} else {
				custom.deleteNote(checkedID);

				// if flag getAll is set, then return whole note array
				if (req.body.getAll) {
					return res.send(custom.getNoteShelf());
				} else {
					return res.send([{"id": "" + req.body.id}]);
				}
			}
		} catch(e) {
			custom.logger(custom.logLevel.error,"route get /notebookDelete: " + e);
		}
	});
};

module.exports = ourAppRouter;
