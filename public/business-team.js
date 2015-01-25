define([
   'jquery',
   'jquery-ui'
], function(
   jquery,
   jqueryui
) {
   var myBar = new progressBar(50);

   function setNumberOfPlayers(n) {
      console.log(n + ' players');
      n = Math.max(2, Math.min(n, 6));
      $('#teamGraphic').append("<img src='team/" + n + ".png'>");
   }

   // Animate the progress bar
   animate(myBar);

   $('#panelRow').delegate('.buttonButton', 'click', function() {
      $(window).trigger('action_taken', event.target.dataset.action);
   });

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

   // Convert list of connected players, convert to HTML, and add to the lobby
   // list. Excludes the current user's name from the list of other players.
   function updateLobbyList(list, identifier) {
      var listHTML = gPlayerList.map(function(user) {
         var meClass = user.identifier === identifier ? ' me' : '';
         var readyText = user.ready ? ' (ready)' : '';
         return '<li><p class="lead' + meClass + '">' + user.username +
          readyText + '</p></li>';
      });

      $('#player_list').html(listHTML.join('\n'));
   }

   $('#start_button').click(function() {
      $(window).trigger('lobby_ready');
   });

   $(window).on('client_start_game', function(ev) {
      $('#landing_page').hide();
      $('#main').show();
   });

   $(window).on('client_fail_stage', function(ev) {
      $('#main').hide();
      $('#game_over').show();
   });

   $(window).on('client_complete_stage', function(ev) {
      $('#main').hide();
      $('#stage_complete').show();
   });

   $(window).on('client_delegate_task', function(event, task) {
      $('#instruction_text').text(task.action);
   });

   $('.back_to_lobby').click(function() {
      $('#game_over').hide();
      $('#landing_page').show();
   });

   $('#teamButton').click(moveTeam);
   function moveTeam() {
      $("#team").animate({left: "+=5%"}, 200);
   }

   function newTask(task) {
      $('#instruction_area').append("<div class='alert alert-success' role='alert'>" + task + "</div>");
   }

   function makeNewPanel(header, button, action) {
      $('#panelRow').append(
         '<div class="col-md-2">' +
            '<h3>' + header + '</h3>' +
            '<br>' +
            '<button type="button" class="btn btn-lg btn-block btn-primary buttonButton" data-action="' + action + '">' +
               button +
            '</button>' +
         '</div>'
      );
   }

   function clearPanels() {
      $('#panelRow').empty();
   }


   return {
      setNumberOfPlayers: setNumberOfPlayers,
      updateLobbyList: updateLobbyList,
      makeNewPanel: makeNewPanel,
      clearPanels: clearPanels,
   }
});
