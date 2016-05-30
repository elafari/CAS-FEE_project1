
// Attach a submit handler to the form
$( "#post-form" ).submit(function( event ) {
 
  // Stop form from submitting normally
  event.preventDefault();
 
  var $form = $( this );
	
	var url = $form.find( "input[name='url']:checked" ).val();
	
	console.log("url = " + url);
	
	// Test: allways the same object...
	var noteArray = {
		"id" : 4,																// id
		"guid" : "werzqwerwqer",								// guid
		"title" : "Titel",											// title
		"description" : "Textinhalt",						// description
		"prio" : "5",														// prio
		"dateCreated" : "20160314231234",				// dateCreated
		"dateFinished" : "20160511141255",			// dateFinished
		"dueDate" : "20160514111055"						// dueDate
	};
 
  // Send the data using post
	var posting = $.post( url, noteArray );
 
  // Put the results in a div
  posting.done(function( data ) {
		
				var items = data.map(function (item) {
					return item["id"] + ' | ' + item["guid"] + ' | ' + item["title"] + ' | ' + item["description"] + ' | ' + item["prio"]  + ' | ' + item["dateCreated"]  + ' | ' + item["dateFinished"]  + ' | ' + item["dueDate"];
				});

				$( "#result" ).empty();

				if (items.length) {
					var content = '<li>' + items.join('</li><li>') + '</li>';
					var list = $('<ul />').html(content);
					$( "#result" ).append( list );
				}	
	
	});
});

