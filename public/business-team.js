$( document ).ready(function() {
	//newPanel();
});

//$('#pane').append("<div class='col-md-5'>content</div>");

function newPanel(name, action, size) {
	$('#topRow').append("<div class='col-md-" + size + "'>" + name + "<br /><button type='button' class='btn btn-default btn-primary'>" + action + "</button></div>");
}

function wipeRow() {
	$('#topRow').empty();
}