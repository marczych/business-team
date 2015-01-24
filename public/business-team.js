$( document ).ready(function() {

   var myBar = new progressBar(50);

   // Animate the progress bar
   animate(myBar);

	panels[0].makePanel();
	panels[1].makePanel();
});

function newPanel(control, action, size) {
	$('#topRow').append("<div class='col-md-" + size + "'>" + control + "<br /><button type='button' class='btn btn-default btn-primary'>" + action + "</button></div>");
}

function wipeRow() {
	$('#topRow').empty();
}

function animate(myBar) {
   myBar.adjustProgressBar();
   setTimeout(animate, 100, myBar);
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
      if (this.percent >= 100) {
         this.setPercent(0);
      }

      if (this.percent < 100) {
         this.setPercent(this.getPercent() + 1);
      }
   }
}

// Go from splash page to lobby page
function viewLobby() {
   $('#splash_page').hide();
   $('#lobby').show();

   // Change background opacity
   $('#big').css('background', 'rgba(255, 255, 255, 0.9)');
}

// Go from lobby page to main game view
function viewGame() {
   $('#landing_page').hide();
   $('#main').show();
}

panels = new Array();
panels.push(new Panel("Business Socks", "switch", "2", "Put on", "Take off"));
panels.push(new Panel("Documents", "button", "1", "Shred"));

function Panel(control, inputType, divWidth, action1, action2, action3) {
	this.control = control;
	this.action1 = action1;
	this.action2 = action2;
	this.action3 = action3;
	this.inputType = inputType;
	this.divWidth = divWidth;

	this.makePanel = function() {
		switch (this.inputType) {
			case "button":
				$('#topRow').append("<div class='col-md-" + divWidth + "'>" + control + "<br /><button type='button' class='btn btn-default btn-primary'>" + action1 + "</button></div>");
				break;

			case "switch":
				$('#topRow').append("<div class='col-md-" + divWidth + "'>" + control + "<br /><div class='btn-group' data-toggle='buttons'><label class='btn btn-primary'><input type='radio' name='control' id='option1' autocomplete='off' checked>" + action1 + "</label><label class='btn btn-primary'><input type='radio' name='options' id='option2' autocomplete='off'>" + action2 + "</label></div></div>");
				break;
		}
	}
}
