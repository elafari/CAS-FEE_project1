
/**
 * This file provides all routes for the note project.
 *
 * @version 1.0
 *
 * @requires helper/helper.js
 *
 */

var helper = require("../helper/helper.js");

var ourAppRouter = function(app) {
	
	app.get("/", function(req, res) {
		res.send("Welcome to this site!");
	});
	
	app.get("/toggleLogInfo", function(req, res) {
		try {
			var currentLogInfo = helper.toggleLogInfo();
			res.send("New log info flag: " + currentLogInfo);
		} catch(e) {
			helper.logger(helper.logLevel.error,"route get /toggleLogInfo: " + e);
		}
	});
	
	app.get("/loadNotes", function(req, res) {
		try {
			var retValue = helper.loadNotes();
			if (retValue == true) {
				helper.logger(helper.logLevel.info,"loadFile - retValue: " + retValue);
				res.send("File loaded .. ");				
			} else {
				res.send("File load error!")
			}

		} catch (e) {
			helper.logger(helper.logLevel.error,"route get /loadFile: "+ e);
			helper.noteShelf = [];
		}
	});
	
	app.get("/saveNotes", function(req, res) {
		try {
			var retValue = helper.saveNotes();
			if (retValue == true) {
				helper.logger(helper.logLevel.info,"saveFile - retValue: " + retValue);
				res.send("File saved .. ");
			} else {
				res.send("File save error!");
			}
		} catch (e) {
			helper.logger(helper.logLevel.error,"route get /saveFile: "+ e);
			helper.noteShelf = [];
		}
	});
	
	app.get("/notebook", function(req, res) {
	
		try {
			var checkedID = helper.checkNotes(req.query.noteid);
			
			if (!req.query.noteid) {
				return res.send({"status": "Fehler", "message": "Keine ID"});
			} else if (checkedID == -1) {
				return res.send({"status": "Fehler", "message": "Unbekannte ID"});
			} else {
				return res.send(helper.getNoteShelf(checkedID));
			}
		} catch(e) {
			helper.logger(helper.logLevel.error,"route get /notebook: " + e);
		}
		
	});
	
	app.get("/notebookall", function(req, res) {
		
		try {
			helper.logger(helper.logLevel.info,"Zeige alle");
			return res.send(helper.getNoteShelf());
		} catch(e) {
			helper.logger(helper.logLevel.error,"route get /notebookall: " + e);
		}
	});

	app.post("/notebookDelete", function(req, res) {

		console.log(req.body);
		try {
			var checkedID = helper.checkNotes(req.body.noteid);
		
			if (!req.body.noteid) {
				helper.logger(helper.logLevel.error,"route get /notebookDelete: Keine ID");
				return res.send({"status": "Fehler", "message": "Keine ID"});
			} else if (checkedID == -1) {
				helper.logger(helper.logLevel.error,"route get /notebookDelete: Unbekannte ID");
				return res.send({"status": "Fehler", "message": "Unbekannte ID"});
			} else {
				helper.deleteNote(checkedID);
				
				return res.send(helper.getNoteShelf());
			}
		} catch(e) {
			helper.logger(helper.logLevel.error,"route get /notebookDelete: " + e);
		}
	});	
	
	app.post("/notebook", function(req, res) {
		try {
			if (helper.checkPostParams(req.body)) {
				helper.addNote(req.body);
								
				return res.send(helper.getNoteShelf());
	
			} else {
				return res.send({"status": "Fehler", "message": "Es fehlt mindestens ein Attribut zur Notiz!"});
			}
		} catch(e) {
			helper.logger(helper.logLevel.error,"route post /notebook: " + e);
		}
	});

	app.post("/notebookUpdate", function(req, res) {
		try {
			if (helper.checkPostParams(req.body,true)) {
				helper.updateNote(req.body);
				
				return res.send(helper.getNoteShelf());

			} else {
				return res.send({"status": "Fehler", "message": "Es fehlt mindestens ein Attribut zur Notiz!"});
			}
		} catch(e) {
			helper.logger(helper.logLevel.error,"route post /notebookUpdate: " + e);
		}
	});
	
}

module.exports = ourAppRouter;
