$( document ).ready(function() {

   var myBar = new progressBar(50);

   // Animate the progress bar
      animate(myBar);
      console.log("finished first animation");

	//newPanel();
});

//$('#pane').append("<div class='col-md-5'>content</div>");

function newPanel(name, action, size) {
	$('#topRow').append("<div class='col-md-" + size + "'>" + name + "<br /><button type='button' class='btn btn-default btn-primary'>" + action + "</button></div>");
}

function wipeRow() {
	$('#topRow').empty();
}
function animate(myBar) {
   console.log("starting to animate");
   myBar.adjustProgressBar();
   setTimeout(myBar.animate, 100);
}

function progressBar(startingPercent) {
   this.percent = startingPercent;
   $('#progressbar').append("<div class='progress-bar progress-bar-striped active' id='thebaritself' role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: " + this.percent + "%'>");

   this.getPercent = function() {
      return this.percent;
   }

   this.setPercent = function(newPercent) {
      $("#thebaritself").width(newPercent + "%");
      this.percent = newPercent;
   }

   this.adjustProgressBar = function() {
      console.log("starting to adjust");
      console.log("percent is " + this.percent);

      if (this.percent >= 100) {
         console.log("got too wide");
         this.setPercent(0);
      }

      this.setPercent(this.getPercent() +10);
      console.log("percent is now " + this.percent);

   }
}

