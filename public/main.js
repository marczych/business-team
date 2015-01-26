requirejs.config({
   "paths": {
      "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
      "jquery-ui": "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min",
      "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min"
   }
});

define(['jquery', 'jquery-ui', 'business-team', 'socket.io/socket.io'],
function(jquery, jqueryui, bt, io) {

   // Data
   ////////////////////////////////////////////////////////////////////////////

   var socket = io();
   var states = {
      lobby: {},
      game: {},
      results: {},
   };
   var state = states.lobby;

   // Network Events
   ////////////////////////////////////////////////////////////////////////////

   socket.on('connected', function(identifier) {
      console.log('connected');

      if (state != states.lobby) {
         console.error('received connected event when not in lobby state');
         return;
      }

      $(window).trigger('client_connected', [identifier]);
   });

   socket.on('disconnected', function(identifier) {
      console.log('disconnected');

      if (state != states.lobby) {
         console.error('received disconnected event when not in lobby state');
         return;
      }

      $(window).trigger('client_disconnected', [identifier]);
   });

   socket.on('game in progress', function() {
      console.error('cannot join game in progress');

      if (state != states.lobby) {
         console.error('received game in progress event when not in lobby state');
         return;
      }

      $(window).trigger('client_game_in_progress');
   });

   socket.on('game ended', function() {
      console.log('game ended');

      if (state != states.game) {
         console.error('received game ended event when not in game state');
         return;
      }

      state = state.lobby;

      $(window).trigger('client_game_ended');
   });

   socket.on('lobby list', function(playerList) {
      console.log('lobby list');

      if (state != states.lobby) {
         console.error('received lobby list event when not in lobby state');
         return;
      }

      $(window).trigger('client_lobby_list', [playerList]);
   });

   socket.on('start game', function(data) {
      console.log('start game');

      if (state != states.lobby) {
         console.error('received start game event when not in lobby state');
         return;
      }

      state = states.game;

      $(window).trigger('client_start_game', [data]);

      socket.emit('game loaded');
   });

   socket.on('start stage', function(data) {
      console.log('stage update');

      if (state != states.game) {
         console.error('received start stage event when not in game state');
         return;
      }

      $(window).trigger('client_start_stage', [data]);

      socket.emit('stage loaded');
   });

   socket.on('state update', function(data) {
      console.log('state update');

      if (state != states.game) {
         console.error('received state update event when not in game state');
         return;
      }

      $(window).trigger('client_state_update', [data]);
   });

   socket.on('complete stage', function() {
      console.log('complete stage');

      if (state != states.game) {
         console.error('received state update event when not in game state');
         return;
      }

      $(window).trigger('client_complete_stage');
   });

   socket.on('fail stage', function() {
      console.log('fail stage');

      if (state != states.game) {
         console.error('received state update event when not in game state');
         return;
      }

      state = states.lobby;

      $(window).trigger('client_fail_stage');
   });

   socket.on('delegate task', function(task) {
      console.log('delegate task');

      if (state != states.game) {
         console.error('received state update event when not in game state');
         return;
      }

      $(window).trigger('client_delegate_task', [task]);
   });

   // UI Events
   ////////////////////////////////////////////////////////////////////////////

   $(window).on('lobby_ready', function(ev) {
      console.log('lobby ready');

      if (state != states.lobby) {
         console.error('fired lobby ready event when not in lobby state');
         return;
      }

      socket.emit('lobby ready');
   });

   $(window).on('lobby_not_ready', function(ev) {
      console.log('lobby not ready');

      if (state != states.lobby) {
         console.error('fired lobby not ready event when not in lobby state');
         return;
      }

      socket.emit('lobby not ready');
   });

   $(window).on('action_taken', function(ev, action) {
      console.log('action taken');

      if (state != states.game) {
         console.error('fired action taken event when not in game state');
         return;
      }

      socket.emit('action taken', action);
   });
});
