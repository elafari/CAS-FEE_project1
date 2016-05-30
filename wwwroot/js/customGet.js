$(document).ready(function () {
	
  $('#get-data-all').click(function () {

    var showData = $('#show-data');

    $.getJSON('http://localhost:4000/notebookall', function (data,status) {

			if (status == 'success'){
				console.log(data);
				

				// filter
				var filter = true;
				var filterCriteria = "dateFinished";

				var dataResult = data;
				if (filter == true) {
					dataResult = cas.fee.helper.filterArray(data,filterCriteria);
				}

				// sort
				var sortCriteria = "dateFinished";
				var sortOrder = true;
				var sortType = 1;
				
				dataResult = cas.fee.helper.sortArray(dataResult,sortCriteria,sortOrder,sortType);

	
				var items = dataResult.map(function (item) {
					
					var dateCreatedOut = item.dateCreated;
					dateCreatedOut = moment(dateCreatedOut,"YYYYMMDDHHmmss").format("YYYY-MM-DD-HH-mm-ss");
					var dueDateOut = item.dueDate;
					dueDateOut = moment(dueDateOut,"YYYYMMDDHHmmss").format("dddd-WW");
					
					return item["id"] + ' | ' + item["guid"] + ' | ' + item["title"] + ' | ' + item["description"] + ' | ' + item["prio"]  + ' | ' + dateCreatedOut  + ' | ' + item["dateFinished"]  + ' | ' + dueDateOut;
					//return item["id"] + ' | ' + item["guid"] + ' | ' + item["title"] + ' | ' + item["description"] + ' | ' + item["prio"]  + ' | ' + item["dateCreated"]  + ' | ' + item["dateFinished"]  + ' | ' + item["dueDate"];
				});

				showData.empty();

				if (items.length) {
					var content = '<li>' + items.join('</li><li>') + '</li>';
					var list = $('<ul />').html(content);
					showData.append(list);
				}
			}
    });

    showData.text('Loading the JSON file.');

  });
	
	$('#get-data-note').click(function () {

    var showData = $('#show-data');

    $.getJSON('http://localhost:4000/notebook?id=3', function (data,status) {
			
			if (status == 'success'){
				console.log(data);

				var items = data.map(function (item) {
					return item["id"] + ' | ' + item["guid"] + ' | ' + item["title"] + ' | ' + item["description"] + ' | ' + item["prio"]  + ' | ' + item["dateCreated"]  + ' | ' + item["dateFinished"]  + ' | ' + item["dueDate"];
				});

				showData.empty();

				if (items.length) {
					var content = '<li>' + items.join('</li><li>') + '</li>';
					var list = $('<ul />').html(content);
					showData.append(list);
				}
			}
    });
    showData.text('Loading the JSON file.');

  });	
	
});



