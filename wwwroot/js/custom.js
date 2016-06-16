'use strict';

var nb = (function () {

    /********************
     * Private
     ********************/
    var privateNotes = [];
    var privateSortCriteria = 'dateCreated';
    var privateSortOrder = true; // ascending
    var privateFilterCriteria = null;

    /**
     * Sort array by given sort criteria
     *
     * @param  {Object}  data - Array which has to be sorted
     * @param  {String}  criteria - Array attribute to sort by
     * @param  {Boolean} order - true=asc, false=desc
     * @return {Object}  Sorted array
     */
    var privateSortArray = function (data, criteria, order) {
        try {
            var sortBy = function (field, reverse, primer) {
                var key = function (x) {
                    return primer ? primer(x[field]) : x[field];
                };

                return function (a, b) {
                    var A = key(a);
                    var B = key(b);
                    return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1, 1][+!!reverse];
                }
            };

            data.sort(sortBy(criteria, order, parseInt));
            return data;

        } catch (e) {
            // @todo: do something with e?
            return data;
        }
    };

    /**
     * Filter array by given filter criteria
     *
     * @param  {Object} data - Array which has to be filtered
     * @param  {String} criteria - Array attribute to filter
     * @return {Object} Filtered array
     */
    var privateFilterArray = function (data, criteria) {
        try {
            var dataFiltered = $.grep(data, function (element) {
                return element[criteria] !== 0; //@todo: only works for numbers
            });
            return dataFiltered;
        } catch (e) {
            // @todo: do something with e?
            return data;
        }
    };

    /********************
     * Public
     ********************/
    var publicLoadNotes = function () {

        var url = 'http://localhost:4000/notebookall';

        $.getJSON(url, function (data) {

            // apply sorting
            privateNotes = privateSortArray(data, privateSortCriteria, privateSortOrder);
            // apply filter
            // @todo: this could also be done by CSS
            if (privateFilterCriteria) {
                privateNotes = privateFilterArray(data, privateFilterCriteria);
            }
            // format dates
            privateNotes = privateNotes.map(function (item) {
                //var dateCreatedOut = moment(item.dateCreated, "YYYYMMDDHHmmss").format("YYYY-MM-DD-HH-mm-ss");
                //var dueDateOut = moment(item.dueDate, "YYYYMMDDHHmmss").format("dddd-WW");
                return item;
            });

            console.log('SUCCESS: data retrieved');
        }).error(function (evt) {
            console.log('ERROR while retrieving data', evt);
        });

    };

    var sortNotes = function (criteria, order) {
        nb.privateSortCriteria = criteria; // @todo: use object with this(=self) context
        nb.privateSortOrder = order;

        privateSortArray(privateNotes, privateSortCriteria, privateSortOrder);
    };

    var publicGetData = function () {
        return privateNotes;
    };

    /**
     * render handlebars template
     */
    var publicRenderTemplate = function (data) {
        var template = Handlebars.compile($('#notes-template').html());
        var notesHtml = template(data);
        $('#notes-container').html(notesHtml);
    };

    /********************
     * Public Interface
     ********************/
    return {
        loadData        : publicLoadNotes,
        getData         : publicGetData,
        sort            : sortNotes,
        renderTemplate  : publicRenderTemplate
    }

})();

$(function () {
    /**
     * prepare theme selection
     */
    var theme = localStorage.getItem('theme') || 'default';
    var linkTag = $('[data-theme="true"]');
    var themePath = linkTag.attr('href');
    var themeBasePath = themePath.substr(0, themePath.lastIndexOf('/') + 1);


    /**
     * get data from server and render it
     * //@todo: moving this after event handlers causes problems with async data loading!!
     */
    nb.loadData();

    setTimeout(function() { //wait for async call to be complete
        var data = nb.getData();
        console.log('data', data);
        nb.renderTemplate(data);
    }, 0);


    /**
     * register event handlers
     */
    $('#select-theme')
        .on('change', function (e) {
            var theme = e.target.value;
            localStorage.setItem('theme', theme);
            linkTag.attr('href', themeBasePath + theme + '.css');
        })
        .val(theme)
        .trigger('change');

    // instantiate modal
    var modal = $('[data-remodal-id=modal]').remodal({
        closeOnCancel: true
    });

    $('#create').click(function() {
        modal.open();
        //@todo: clear form
    });

    $('#save').on('click', function () {
        console.log('Save button is clicked');
    });

    $('#cancel').on('click', function () {
        console.log('Cancel button is clicked');
        modal.close();
    });


    $('#notes-container').on('change', '[id^=finish-]', function (evt) {

        console.log('finish-evt', evt);
        var id = evt.target.id.split('-')[1];

        // call server

        $('#note-' + id).fadeOut('slow');
    });
});































