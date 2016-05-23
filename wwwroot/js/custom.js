console.log('test custom.js');

var data = [
    {"id": "01", "title": "implement HTML", "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "prio": 3, "dateCreated": "20161231235959", "dateFinished": "20161231235959", "dueDate": "20161231235959"},
    {"id": "02", "title": "implement CSS", "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "prio": 2},
    {"id": "03", "title": "implement JS frontend", "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "prio": 1},
    {"id": "04", "title": "implement JS backend", "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "prio": 0},
    {"id": "05", "title": "make music", "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "prio": 0},
    {"id": "06", "title": "jump around", "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "prio": 0},
    {"id": "07", "title": "go to sleep", "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "prio": 0}
];

$(function () {
    console.log('ready');

    var template = Handlebars.compile($('#notes-template').html());
    var notesHtml = template(data);
    $('#notes').html(notesHtml);
});
