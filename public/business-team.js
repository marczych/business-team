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

var progressBar = function (startingPercent = 0) {
   this.percent = startingPercent;
	$('#progressbar').append("<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: " + this.percent + "%">");

}

progressBar.prototype.setPercent = function(newPercent) {
   this.percent = newPercent;
}
