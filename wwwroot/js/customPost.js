
// Attach a submit handler to the form
$( "#post-form" ).submit(function( event ) {
 
  // Stop form from submitting normally
  event.preventDefault();
 
  var $form = $( this );
	
	var url = $form.find( "input[name='url']:checked" ).val();
	var param1 = $form.find("input[name='param1']").val();
	
	console.log("url = " + url);
	console.log("param1 = " + param1);
	
	if (param1 == "") {
		param1 = "0";
	}
	
	// Test: allways the same object...
	var noteArray = {
		"id" : parseInt(param1),								// id
		"guid" : "werzqwerwqer",								// guid
		"title" : "Titel",											// title
		"description" : "Textinhalt",						// description
		"prio" : "5",														// prio
		"dateCreated" : "20160313231234",				// dateCreated
		"dateFinished" : "20160409111055",			// dateFinished
		"dueDate" : "20160514111055"						// dueDate
	};
	
	// Send the data using post
	var posting = $.post( url, noteArray );
	
	// Put the results in a div
	posting.done(function( data ) {
		
				if (data.status == "error") {
					console.log("post response: " + data.status + " - " + data.message);	
				} else {
					var items = data.map(function (item) {
						return item["id"] + ' | ' + item["guid"] + ' | ' + item["title"] + ' | ' + item["description"] + ' | ' + item["prio"]  + ' | ' + item["dateCreated"]  + ' | ' + item["dateFinished"]  + ' | ' + item["dueDate"];
					});

					$( "#result" ).empty();

					if (items.length) {
						var content = '<li>' + items.join('</li><li>') + '</li>';
						var list = $('<ul />').html(content);
						$( "#result" ).append( list );
					}
				}
	
	});

});

