
/**
 * Main app for the note project.
 *
 * @version 1.0
 *
 * @requires express
 * @requires body-parser
 * @requires helper/helper.js
 *
 */
 
var express = require("express");
var bodyParser = require("body-parser");

var helper = require("./helper/helper.js");

var _port = 4000;

var app = express();

// Use bodyParser to allow process POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/front-test',express.static('wwwroot'));

// Define routes
var ourAppRouter = require("./routes/routes.js")(app);

// Start server to listen..
var server = app.listen(_port, function () {
	helper.logger(helper.logLevel.info,"Server is listening on port: " + server.address().port);
})