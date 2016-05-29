$(document).ready(function () {
	
  $('#get-data-all').click(function () {

    var showData = $('#show-data');

    $.getJSON('http://localhost:4000/notebookall', function (data,status) {

			if (status == 'success'){
				console.log(data);
				
				var sortCriteria = "dateFinished";
				var sortOrder = true;
				var filterCriteria = "dateFinished";
				
				// sort data
				var sort_by = function(field, reverse, primer){
					 var key = function (x) {return primer ? primer(x[field]) : x[field]};

					 return function (a,b) {
						var A = key(a), B = key(b);
						return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];                  
					 }
				}
				data.sort(sort_by(sortCriteria,sortOrder,parseInt));

				// filter data
				var dataFiltered = $.grep(data, function(element, index){
						return element[filterCriteria] != "";
				});
				
				
				var items = dataFiltered.map(function (item) {
					
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



