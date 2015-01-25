define([
   'jquery',
   'jquery-ui'
], function(
   jquery,
   jqueryui
) {
   var panels = new Array();
   var myBar = new progressBar(50);

   // Animate the progress bar
   animate(myBar);

   panels.push(new Panel("Front Door", "button", "2", "Open"));
   panels.push(new Panel("Documents", "button", "2", "Shred"));
   panels.push(new Panel("TPS Reports", "button", "2", "File"));
   panels.push(new Panel("Workers", "button", "2", "Manage"));
   panels.push(new Panel("Bottom Line", "button", "2", "Reiterate"));
   panels.push(new Panel("The Cloud", "button", "2", "Embrace"));
   panels.push(new Panel("Jeans", "button", "2", "Wear on Casual Friday"));
   panels.push(new Panel("All Hands Meeting", "button", "2", "Attend"));
   panels.push(new Panel("Overtime", "button", "2", "Work"));
   panels.push(new Panel("Dwight", "button", "2", "Prank"));
   panels.push(new Panel("Customers", "button", "2", "Avoid"));
   panels.push(new Panel("Cocaine!!", "button", "2", "Cocaine??"));
   panels.push(new Panel("Costs", "button", "2", "Cut"));
   panels.push(new Panel("Buy-in", "button", "2", "As for"));
   panels.push(new Panel("S.W.A.T. Team", "button", "2", "Call"));
   panels.push(new Panel("Running", "button", "2", "Hit the Ground"));
   panels.push(new Panel("Paradigm Shift", "button", "2", "Initiate"));
   panels.push(new Panel("Default Password", "button", "2", "Change"));
   panels.push(new Panel("Customers", "button", "2", "Touch Base With"));
   panels.push(new Panel("Quarterly Report", "button", "2", "Present"));
   panels.push(new Panel("Radar", "button", "2", "Get On"));
   panels.push(new Panel("Banana Stand", "button", "2", "Burn The"));
   panels.push(new Panel("Open", "button", "2", "Keep The Door"));
   panels.push(new Panel("Paradigm Shifts", "button", "2", "Experience"));
   panels.push(new Panel("Target Audience", "button", "2", "Find"));
   panels.push(new Panel("401K", "button", "2", "Invest in"));
   panels.push(new Panel("Kool-Aid", "button", "2", "Drink"));
   panels.push(new Panel("Ship", "button", "2", "Abandon"));
   panels.push(new Panel("Suppliers", "button", "2", "Leverage"));
   panels.push(new Panel("Full Service ;)", "button", "2", "Offer"));
   panels.push(new Panel("Retirement", "button", "2", "Daydream about"));
   panels.push(new Panel("Off the Record", "button", "2", "Talk"));
   panels.push(new Panel("Receipts", "button", "2", "Collect"));

   $('#addPanel').click(newButtons);

   newButtons();
   $('#panelRow').delegate('.buttonButton', 'click', function() {
      $(window).trigger('action_taken', event.target.dataset.key);
   });

   function newButtons() {
      wipeRow();
      for(i = 0; i < 10; i++) {
         panels[Math.floor(Math.random()*panels.length)].makePanel();
      }
   }

   function newPanel(control, action, size) {
	   $('#panelRow').append("<div class='col-md-" + size + "'>" + control + "<br /><button type='button' class='btn btn-default btn-primary'>" + action + "</button></div>");
   }

   function wipeRow() {
	   $('#panelRow').empty();
   }

   function newPanel(control, action, size) {
      $('#topRow').append("<div class='col-md-" + size + "'>" + control + "<br /><button type='button' class='btn btn-default btn-primary'>" + action + "</button></div>");
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

   $('#start_button').click(function() {
      $(window).trigger('lobby_ready');
   });

   $(window).on('client_start_game', function(ev) {
      $('#landing_page').hide();
      $('#main').show();
   });

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
               $('#topRow').append("<div class='col-md-" + divWidth + "'><h3>" + control + "</h3><button type='button' class='btn btn-lg btn-block btn-primary'>" + action1 + "</button></div>");
               break;

            case "switch":
               $('#topRow').append("<div class='col-md-" + divWidth + "'><h3>" + control + "</h3><div class='btn-group' data-toggle='buttons'><label class='btn btn-lg btn-block btn-primary'><input type='radio' name='control' id='option1' autocomplete='off' checked>" + action1 + "</label><label class='btn btn-lg btn-block btn-primary'><input type='radio' name='options' id='option2' autocomplete='off'>" + action2 + "</label></div></div>");
               break;
         }
      }
   }

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
               $('#topRow').append("<div class='col-md-" + divWidth + "'><h3>" + control + "</h3><button type='button' class='btn btn-lg btn-block btn-primary'>" + action1 + "</button></div>");
               break;

            case "switch":
               $('#topRow').append("<div class='col-md-" + divWidth + "'><h3>" + control + "</h3><div class='btn-group' data-toggle='buttons'><label class='btn btn-lg btn-block btn-primary'><input type='radio' name='control' id='option1' autocomplete='off' checked>" + action1 + "</label><label class='btn btn-lg btn-block btn-primary'><input type='radio' name='options' id='option2' autocomplete='off'>" + action2 + "</label></div></div>");
               break;
         }
      }
   }
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
               $('#panelRow').append("<div class='col-md-" + divWidth + "'><h3>" + control + "</h3><button data-key='" + action1 + " " + control + "' type='button' class='btn btn-lg btn-block btn-primary buttonButton'>" + action1 + "</button></div>");
               break;

            case "switch":
               $('#panelRow').append("<div class='col-md-" + divWidth + "'><h3>" + control + "</h3><div class='btn-group' data-toggle='buttons'><label class='btn btn-lg btn-block btn-primary'><input type='radio' name='control' id='option1' autocomplete='off' checked>" + action1 + "</label><label class='btn btn-lg btn-block btn-primary'><input type='radio' name='options' id='option2' autocomplete='off'>" + action2 + "</label></div></div>");
               break;
         }
      }
   }
});
