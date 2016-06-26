'use strict';

var nb = (function () {
    /********************
     * Private
     ********************/
    var privateNotes = [];
    var privateSortCriteria = 'dateCreated';
    var privateSortOrder = false; // ascending

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
                };
            };

            data.sort(sortBy(criteria, order, parseInt));
            return data;

        } catch (e) {
            // @todo: do something here
            return data;
        }
    };

    var privateGetFormData = function () {
        var form = $('#create-note');
        var formData = {
            id: form.find('#id').val(),
            title: form.find('#title').val(),
            description: form.find('#description').val(),
            prio: form.find('#prio').val(),
            dueDate: form.find('#dueDate').val()
        };

        formData.id = formData.id ? Number(formData.id) : null;
        formData.dueDate = privateConvertToServerDate(formData.dueDate);

        return formData;
    };

    var privateSetFinished = function(id, finishedDate) {
        privateNotes.some(function (val, idx, arr) {
            if (val.id === id) {
                arr[idx].dateFinished = finishedDate;
                return true;
            }
        });
    };

    /**
     * Remove deleted entry from local data
     *
     * @param  {String} id - property of entry to be removed
     */
    var privateRemoveNote = function (id) {
        privateNotes.some(function (val, idx, arr) {
            if (val.id === id) {
                arr.splice(idx, 1);
                return true;
            }
        });
    };

    /**
     * render handlebars template
     */
    var privateRenderTemplate = function () {
        var data = privateNotes.map(function (dataItem) {
            // format dates
            var item = $.extend({}, dataItem); // we don't wanna change the original object and therefore make a copy //@todo: this is probably not the most elegant way to do this
            var dates = [
                'dueDate',
                'dateCreated',
                'dateFinished'
            ];
            dates.forEach(function (val) {
                item[val] = privateConvertToViewDate(item[val]);
            });

            // add finished flag
            if (Number(dataItem.dateFinished) > 0) {
                item._isFinished = true;
            }
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
    var publicLoadData = function () {
        var url = 'http://localhost:4000/notebookall';
        $.getJSON(url).done(function (data) {
            if (data.status !== 'error') {
                privateNotes = privateSortArray(data, privateSortCriteria, privateSortOrder);
                privateRenderTemplate();

                console.log('SUCCESS: data retrieved', data); // @todo: message toast instead
            } else {
                console.log('ERROR while retrieving data', evt); // @todo: message toast instead
            }
        });
    };

    var publicGetData = function () {
        return privateNotes;
    };

    var publicSave = function () {
        var url = 'http://localhost:4000/notebook';
        var formData = privateGetFormData();
        //formData.getAll = true; // force the server to put all notes in the response

        $.post(url, formData).done(function (data) {
            if (data.status !== 'error') {
                var action = data[0]._action;
                var id = Number(data[0].id);
                var createdDate = data[0].dateCreated;
                var finishedDate = data[0].dateFinished;

                formData.id = id;
                formData.dateCreated = createdDate;
                formData.dateFinished = finishedDate;

                if (action === 'updated') {
                    privateNotes.some(function (val, idx, arr) {
                        if (val.id === id) {
                            arr.splice(idx, 1, formData);
                            return true;
                        }
                    });
                } else {
                    privateNotes.push(formData);

                    var body = $('body');
                    if (body.hasClass('show-finished')) {
                        $('#show-finished').trigger('click');

                        //body.removeClass('show-finished');
                    }
                }

                privateRenderTemplate();

                console.log('SUCCESS: entry created', data); // @todo: message toast instead
            } else {
                console.log('ERROR while posting data'); // @todo: message toast instead
            }
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

        elements.forEach(function (selector) {
            form.find(selector).val('');
        });
    };

    var publicSortNotes = function (criteria) {
        //privateSortOrder = privateSortOrder || true; //true=asc

        // save states
        if (criteria === privateSortCriteria){
            privateSortOrder = !privateSortOrder;
        } else {
            privateSortOrder = true; //true = ascending
        }
        privateSortCriteria = criteria;

        privateNotes = privateSortArray(privateNotes, privateSortCriteria, privateSortOrder);
    };

    var publicSetFormValues = function (values) {
        var form = $('#create-note');

        $.each(JSON.parse(values), function (key, val) {
            console.log(key, val);

            if (privateDateFields.indexOf(key) > -1) {
                //convert it to view style
                val = privateConvertToFormDate(val);
                console.log('convert', key, val);
            }
            form.find('#' + key).val(val);
        });
    };

    var publicDelete = function (id) {
        var url = 'http://localhost:4000/notebookDelete';
        var formData = {id: id};

        //@todo: make private callDelete(requestBody)
        $.post(url, formData).done(function (data) {
            if (data.status !== 'error') {
                privateRemoveNote(data.id);
                privateRenderTemplate();

                console.log('SUCCESS: entry deleted', data); // @todo: message toast instead
            } else {
                console.log('ERROR while posting data', evt); // @todo: message toast instead
            }
        });
    };

    var publicSetFinished = function(id, isChecked){
        var url = 'http://localhost:4000/notebook';
        var dateFinished = isChecked ? 'set' : '0';
        var formData = {
            id          : id,
            dateFinished: dateFinished
        };

        $.post(url, formData).done(function (data) {
            if (data.status !== 'error') {
                var id = Number(data[0].id);
                var dateFinished = Number(data[0].dateFinished);
                var row = $('#note-' + id);

                privateSetFinished(id, dateFinished);

                row.css('color', 'green');

                if (isChecked) {
                    row.addClass('finished');
                } else {
                    row.removeClass('finished');
                }

                console.log('SUCCESS: finished date set', data); // @todo: message toast instead
            } else {
                console.log('ERROR while posting data'); // @todo: message toast instead
            }
        });
    };

    /********************
     * Public Interface
     ********************/
    return {
        loadData    : publicLoadData,
        saveNote    : publicSave,
        setFinished : publicSetFinished,
        deleteNote  : publicDelete,

        getData     : publicGetData,
        sort        : publicSortNotes,
        clearForm   : publicClearForm,
        render      : privateRenderTemplate,
        setFormValues: publicSetFormValues
    }; //@todo: move registration of event handlers to public init-method, so that less methods need to be exposed

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
        nb.saveNote();
    });

    $(document).on('closed', '.remodal', function () {
        nb.clearForm();
    });

    $('#notes-container').on('change', '[id^=finish-]', function (evt) {
        console.log('finish-evt', evt);
        var id = evt.target.id.split('-')[1];
        var isChecked = evt.target.checked;

        nb.setFinished(id, isChecked);
    })
    .on('click', '[id^=edit-]', function (evt) {
        console.log('edit-evt', evt);
        var id = evt.target.id.split('-')[1];
        var formValues;

        nb.getData().some(function (val) {
            if (val.id === Number(id)) {
                formValues = JSON.stringify(val);

                nb.setFormValues(formValues);
                return true;
            }
        });

        // open form
        var modalObj = $('[data-remodal-id=modal]').remodal();
        modalObj.open();
    })
    .on('click', '[id^=delete-]', function (evt) {
        console.log('delete-evt', evt);
        var id = evt.target.id.split('-')[1];

        nb.deleteNote(id);
    });

    $('#show-finished').on('click', function (e) {
        var container = $('body');

        if (container.hasClass('show-finished')) {
            container.removeClass('show-finished');
            $(e.target).text('Show Finished');
        } else {
            container.addClass('show-finished');
            $(e.target).text('Show Pending');
        }
    });

    $('.sort-btn').on('click', function(e){
        var target = $(e.target);
        var field  = target.data('sort');
        var button = target[0];

        nb.sort(field);
        nb.render();

        $('.sort-btn').css('font-weight', 'normal');
        $(button).css('font-weight', 'bold'); // @todo: add icon that indicates sort order
    });

    /**
     * get data from server and render it
     */
    nb.loadData();
});