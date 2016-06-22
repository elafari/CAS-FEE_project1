'use strict';

var nb = (function () {
    /********************
     * Private
     ********************/
    var privateNotes = [];
    var privateSortCriteria = 'dateCreated';
    var privateSortOrder = true; // ascending
    var privateFilterCriteria = null;

    var privateDateFields = [
        'dueDate',
        'dateCreated',
        'dateFinished'
    ];

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

    var privateGetFormData = function () {
        var form = $('#create-note');
        var formData = {
            id          : form.find('#id').val(),
            title       : form.find('#title').val(),
            description : form.find('#description').val(),
            prio        : form.find('#prio').val(),
            dueDate     : form.find('#dueDate').val()
        };
        formData.dueDate = privateConvertToServerDate(formData.dueDate);

        return formData;
    };

    /**
     * Remove deleted entry from local data
     *
     * @param  {String} id - property of entry to be removed
     */
    var privateRemoveNote = function(id) {
        privateNotes.some(function(val, idx){
            if (val.id === Number(id)) {
                privateNotes.splice(idx, 1);
                return true;
            }
        });
    };

    /**
     * render handlebars template
     */
    var privateRenderTemplate = function () {
        // format dates
        // @todo: check if this works with created and finish date

        var data = privateNotes.map(function(dataItem) {
            var item = $.extend({}, dataItem); // we don't wanna change the original object and therefore make a copy //@todo: probably not the most elegant way to do this
            var dates = [
                'dueDate',
                'dateCreated',
                'dateFinished'
            ];
            dates.forEach(function(val){
                item[val] = privateConvertToViewDate(item[val]);
            });
            return item;
        });

        var template = Handlebars.compile($('#notes-template').html());
        var notesHtml = template(data);
        $('#notes-container').html(notesHtml);
    };

    var privateConvertToViewDate = function (date) {
        if (moment(date, "YYYYMMDDHHmmss", true).isValid()) {
            return moment(date, "YYYYMMDDHHmmss").format("DD.MM.YYYY");
        }
        return date;
    };

    var privateConvertToFormDate = function (date) {
        if (moment(date, "YYYYMMDDHHmmss", true).isValid()) {
            return moment(date, "YYYYMMDDHHmmss").format("YYYY-MM-DD");
        }
        return date;
    };

    var privateConvertToServerDate = function (date) {
        if (moment(date, "YYYY-MM-DD", true).isValid()) {
            return moment(date, "YYYY-MM-DD").format("YYYYMMDDHHmmss");
        }
        return date;
    };

    /********************
     * Public
     ********************/
    var publicLoadNotes = function () {
        var url = 'http://localhost:4000/notebookall';
        $.getJSON(url)
            .done(function (data) {
                // apply sorting
                privateNotes = privateSortArray(data, privateSortCriteria, privateSortOrder);
                // apply filter
                // @todo: this could also be done by CSS
                if (privateFilterCriteria) {
                    privateNotes = privateFilterArray(data, privateFilterCriteria);
                }


                privateRenderTemplate();

                //console.log('SUCCESS: data retrieved', data);
            })
            .error(function (evt) {
                console.log('ERROR while retrieving data', evt); // @todo: message toast
            });
    };

    var publicGetData = function () {
        return privateNotes;
    };

    var publicCreate = function () {
        var url = 'http://localhost:4000/notebook';
        // @todo: does server create id, dataCreated and (empty) dateFinished?
        var formData = privateGetFormData();

        $.post(url, formData)
            .done(function (data) {
                formData.id = Number(data[0].id);
                formData.dateCreated = Number(data[0].dateCreated);
                privateNotes.push(formData);
                privateRenderTemplate();

                // message toast
                console.log('SUCCESS: entry created', data);
            })
            .error(function (evt) {
                console.log('ERROR while posting data', evt);
            });
    };

    var publicClearForm = function () {
        var form = $('#create-note');
        var elements = [
            '#title',
            '#description',
            '#prio',
            '#dueDate',
            '#dateCreated',
            '#dateFinished'
        ];

        elements.forEach(function(selector) {
            form.find(selector).val('');
        });
    };

    var sortNotes = function (criteria, order) {
        nb.privateSortCriteria = criteria; // @todo: use object with this(=self) context
        nb.privateSortOrder = order;

        privateSortArray(privateNotes, privateSortCriteria, privateSortOrder);
    };

    var publicSetFormValues = function(values) {
        var form = $('#create-note');

        $.each(JSON.parse(values), function(key, val) {
            console.log(key, val);

            if (privateDateFields.indexOf(key) > -1) {
                //convert it to view style
                val = privateConvertToFormDate(val);
                console.log('convert', key, val);
            }
            form.find('#' + key).val(val);
        });
    };

    var publicDeleteNote = function(id) {
        var url = 'http://localhost:4000/notebookDelete';
        var formData = {id: id};

        //@todo: make private callDelete(requestBody)
        $.post(url, formData)
            .done(function (data) {

                privateRemoveNote(id);
                privateRenderTemplate();

                // message toast
                console.log('SUCCESS: entry deleted', data);
            })
            .error(function (evt) {
                console.log('ERROR while posting data', evt);
            });
    };

    //@todo: delete this
    var publicGetNotes = function(){
        return privateNotes
    };

    /********************
     * Public Interface
     ********************/
    return {
        loadData    : publicLoadNotes,
        getData     : publicGetData,
        sort        : sortNotes,
        createNote  : publicCreate,
        clearForm   : publicClearForm,
        render      : privateRenderTemplate,
        setFormValues: publicSetFormValues,
        deleteNote  : publicDeleteNote,
        _notes : publicGetNotes // @todo: delete this
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


    $('#create').click(function () {
        var modalObj = $('[data-remodal-id=modal]').remodal();
        modalObj.open();
    });

    $(document).on('confirmation', '.remodal', function () {
        nb.createNote();
    });

    $(document).on('closed', '.remodal', function () {
        nb.clearForm();
    });


    $('#notes-container').on('change', '[id^=finish-]', function (evt) {
        console.log('finish-evt', evt);

        var id = evt.target.id.split('-')[1];

        // @todo: call server to set flag
        $('#note-' + id).fadeOut('slow');

    }).on('click', '[id^=edit-]', function (evt) {
        console.log('edit-evt', evt);
        var id = evt.target.id.split('-')[1];
        var formValues;

        nb.getData().some(function(val) {
            if (val.id === Number(id)) {
                formValues = JSON.stringify(val);

                nb.setFormValues(formValues);
                return true;
            }
        });

        // open form
        var modalObj = $('[data-remodal-id=modal]').remodal();
        modalObj.open();
    }).on('click', '[id^=delete-]', function (evt) {
        console.log('delete-evt', evt);
        var id = evt.target.id.split('-')[1];

        nb.deleteNote(id);
    });

    $('#show-finished').on('click', function () {
        // @todo: make toggleable

    });

    /**
     * get data from server and render it
     */
    nb.loadData();
});