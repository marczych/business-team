define(['jquery', 'jquery-ui'], function(jquery, jqueryui) {

   // Data
   ////////////////////////////////////////////////////////////////////////////

   var identifier;
   var playerList;
   var gameState;
   var stageState;

   // Helpers
   ////////////////////////////////////////////////////////////////////////////

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

   // Convert list of connected players, convert to HTML, and add to the lobby
   // list. Excludes the current user's name from the list of other players.
   function updateLobbyList() {
      var listHTML = playerList.map(function(user) {
         var meClass = user.identifier === identifier ? ' me' : '';
         var readyText = user.ready ? ' (ready)' : '';
         return '<li><p class="lead' + meClass + '">' + user.username +
          readyText + '</p></li>';
      });

      $('#player_list').html(listHTML.join('\n'));
   }

   // Actions
   ////////////////////////////////////////////////////////////////////////////

   $('#start_button').click(function() {
      $(window).trigger('lobby_ready');
   });

   $('#panelRow').delegate('.buttonButton', 'click', function() {
      $(window).trigger('action_taken', [event.target.dataset.action]);
   });

   $('.back_to_lobby').click(function() {
      $('#game_over').hide();
      $('#landing_page').show();
   });

   // Reactions
   ////////////////////////////////////////////////////////////////////////////

   $(window).on('client_connected', function(ev, playerIdentifier) {
      identifier = playerIdentifier;
   });

   $(window).on('client_disconnected', function(ev, playerIdentifier) {
      playerList = playerList.filter(function(user) {
         return user.identifier !== data;
      });

      updateLobbyList();
   });

   $(window).on('client_game_ended', function(ev) {
      window.location.reload();
   });

   $(window).on('client_lobby_list', function(ev, currentPlayerList) {
      playerList = currentPlayerList;
      updateLobbyList();
   });

   $(window).on('client_start_game', function(ev, data) {
      gameState = data;
      $('#landing_page').hide();
      $('#main').show();
   });

   $(window).on('client_start_stage', function(ev, data) {
      stageState = data;
      clearPanels();
      data.panels.forEach(function(panel) {
         makeNewPanel(panel.header, panel.button, panel.action);
      });
   });

   $(window).on('client_state_update', function(ev, data) {
      stageState = data;
      $('.number').text(data.numCompletedTasks);
   });

   $(window).on('client_complete_stage', function(ev) {
      $('#main').hide();
      $('#stage_complete').show();
   });

   $(window).on('client_fail_stage', function(ev) {
      $('#main').hide();
      $('#game_over').show();
   });

   $(window).on('client_delegate_task', function(event, task) {
      $('#instruction_text').text(task.action);
   });
});
