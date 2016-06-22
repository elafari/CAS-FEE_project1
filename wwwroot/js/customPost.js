// Attach a submit handler to the form
$("#post-form").submit(function (event) {

    // Stop form from submitting normally
    event.preventDefault();

    var $form = $(this);

    var url = $form.find("input[name='url']:checked").val();
    var param1 = $form.find("input[name='param1']").val();
    var param2 = $form.find("input[name='param2']").val();

    console.log("url = " + url);
    console.log("param1 = " + param1 + " | param2 = " + param2);

    // Test: add note
    if (param2 == "1") {
        var noteArray = {
            "title": "Title-added",									// title
            "description": "Textinhalt-added",						// description
            "prio": "5",										    // prio
            "dueDate": "20160514111055",						    // dueDate
            "getAll": ""
        };
    };
    // Test: update some data
    if (param2 == "2") {
        var noteArray = {
            "id": parseInt(param1),								// id
            "title": "Title-changed2",							// title
            "prio": "4",										// prio
            "dueDate": "20170514111055",						// dueDate
        };
    };
    // Test: update dateFinished reset
    if (param2 == "3") {
        var noteArray = {
            "id": parseInt(param1),								// id
            "dateFinished": "0",					            // dateFinished
        };
    };
    // Test: update dateFinished set
    if (param2 == "4") {
        var noteArray = {
            "id": parseInt(param1),								// id
            "dateFinished": "20170514111055",					// dateFinished
        };
    };
    // Test: delete
    if (param2 == "5") {
        var noteArray = {
            "id": parseInt(param1),								// id
        };
    };


    // Send the data using post
    try {
        var posting = $.post(url, noteArray);
    } catch(e){
        console.log("post error: " + e);
    }

    // Put the results in a div
    posting.done(function (data) {

        if (data.status == "error") {
            console.log("post response: " + data.status + " - " + data.message);
        } else {
            try {
                console.log("response data: " + data);
                var items = data.map(function (item) {
                    return item["id"] + ' | ' + item["guid"] + ' | ' + item["title"] + ' | ' + item["description"] + ' | ' + item["prio"] + ' | ' + item["dateCreated"] + ' | ' + item["dateFinished"] + ' | ' + item["dueDate"];
                });

                $("#result").empty();

                if (items.length) {
                    var content = '<li>' + items.join('</li><li>') + '</li>';
                    var list = $('<ul />').html(content);
                    $("#result").append(list);
                }
            } catch(e) {
                console.log("post response error: " + e)
            }
        }

    });

});

