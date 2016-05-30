var data = [
    {
        "id": "01",
        "title": "implement HTML",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "prio": 3,
        "dateCreated": "20161231235959",
        "dateFinished": "20161231235959",
        "dueDate": "20161231235959"
    },
    {
        "id": "02",
        "title": "implement CSS",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "prio": 2
    },
    {
        "id": "03",
        "title": "implement JS frontend",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "prio": 1
    },
    {
        "id": "04",
        "title": "implement JS backend",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "prio": 0
    },
    {
        "id": "05",
        "title": "make music",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "prio": 0
    },
    {
        "id": "06",
        "title": "jump around",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "prio": 0
    },
    {
        "id": "07",
        "title": "go to sleep",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "prio": 0
    }
];

$(function () {
    /**
     * render handlebars template
     */
    var template = Handlebars.compile($('#notes-template').html());
    var notesHtml = template(data);
    $('#notes').html(notesHtml);


    /**
     * prepare theme selection
     */
    var theme = localStorage.getItem('theme') || 'default';
    console.log('theme', theme);
    var linkTag = $('[data-theme="true"]');
    var themePath = linkTag.attr('href');
    var themeBasePath = themePath.substr(0, themePath.lastIndexOf('/') + 1);

    /**
     * register event handlers
     */
    // change theme
    $('#select-theme')
        .on('change', function (e) {
            var theme = e.target.value;
            localStorage.setItem('theme', theme);
            linkTag.attr('href', themeBasePath + theme + '.css');
            console.log(themeBasePath + theme + '.css');
        })
        .val(theme)
        .trigger('change');
});
