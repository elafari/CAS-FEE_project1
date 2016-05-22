
// Attach a submit handler to the form
$( "#post-form" ).submit(function( event ) {
 
  // Stop form from submitting normally
  event.preventDefault();
 
  var $form = $( this );
	
	var url = $form.find( "input[name='url']:checked" ).val();
	
	console.log("url = " + url);
	
	// Test: allways the same object...
	var noteArray = {
		"noteid" : "4",
		"guid" : "werzqwerwqer",
		"title" : "Titel",
		"text" : "Textinhalt",
		"importance" : "5",
		"datecreate" : "20160314231234",
		"datefinished" : "20160314231245",
		"datetarget" : "20160314231255",
	};
 
  // Send the data using post
	var posting = $.post( url, noteArray );
 
  // Put the results in a div
  posting.done(function( data ) {
		
				var items = data.map(function (item) {
					return item.noteid + ' | ' + item.guid + ' | ' + item.title + ' | ' + item.importance  + ' | ' + item.datecreate  + ' | ' + item.datefinished  + ' | ' + item.datetarget;
				});

				$( "#result" ).empty();

				if (items.length) {
					var content = '<li>' + items.join('</li><li>') + '</li>';
					var list = $('<ul />').html(content);
					$( "#result" ).append( list );
				}	
	
	});
});

