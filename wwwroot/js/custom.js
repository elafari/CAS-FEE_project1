'use strict';

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


/*
 var notebookFactory = (function () {

 /**
 * Private
 *
 var privateInstance = null;

 var privateObject = function () {
 var self = this;

 self.pageObjArray = [];

 self.setPageObj = function (pageObj) {
 };

 self.getPageObjById = function (pageId) {
 };
 };

 /**
 * Public
 *
 var publicCreate = function () {
 if (!privateInstance) {
 privateInstance = new privateObject();
 }
 return privateInstance;
 };

 return {
 create: publicCreate
 };

 })();

 var nb = notebookFactory.create();
 */

var nb = (function () {

    /********************
     * Private
     ********************/
    var _persons = [
        {id: '0001', name: 'meier', firstname: 'hans'},
        {id: '0002', name: 'müller', firstname: 'peter'},
        {id: '0003', name: 'koller', firstname: 'ruedi'}
    ];

    /********************
     * Public
     ********************/
    /**
     * Filter array by given filter criteria
     * @param {Object} data Array which has to be filtered
     * @param {String} filterCriteria Array attribute to filter
     * @return {Object} Filtered array
     */
    var filterArray = function (data, filterCriteria) {
        try {
            var dataFiltered = $.grep(data, function (element, index) {
                return element[filterCriteria] != "";
            });
            return dataFiltered;
        } catch (e) {
            return data;
        }
    };

    /**
     * Sort array by given sort criteria
     * @param {Object} data Array which has to be sorted
     * @param {String} sortCriteria Array attribute to sort by
     * @param {Boolean} sortOrder true=asc, false=desc
     * @return {Object} Sorted array
     */
    var sortArray = function (data, sortCriteria, sortOrder, sortType) {
        try {
            var sort_by = function (field, reverse, primer) {
                var key = function (x) {
                    return primer ? primer(x[field]) : x[field]
                };

                return function (a, b) {
                    var A = key(a), B = key(b);
                    return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1, 1][+!!reverse];
                }
            };
            data.sort(sort_by(sortCriteria, sortOrder, parseInt));
            return data;
        } catch (e) {
            return data;
        }
    };

    /********************
     * Public Interface
     ********************/
    return {
        sortArray: sortArray,
        filterArray: filterArray
    }

})();


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
        })
        .val(theme)
        .trigger('change');
});
