requirejs.config({
   "paths": {
      "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
      "jquery-ui": "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min",
      "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min"
   }
});

define([
   'jquery',
   'jquery-ui',
   'business-team',
   'socket.io/socket.io',
   'business-team'
], function(
   jquery,
   jqueryui,
   bt,
   io,
   bt
) {
   var $window = $(window);
   var socket = io();
   var identifier = undefined;
   var states = {
      lobby: {},
      game: {},
      results: {},
   };
   var state = states.lobby;

   $window.keydown(function(ev) {
      socket.emit('keypress', {
         keyCode: ev.keyCode
      });
   });

   socket.on('connected', function(data) {
      console.log('connected');

      if (state != states.lobby) {
         console.error('received connected event when not in lobby state');
         return;
      }

      identifier = data;
      console.log(data);
   });

   socket.on('game in progress', function() {
      console.error('cannot join game in progress');
   });

   socket.on('lobby list', function(data) {
      console.log('lobby list');

      gPlayerList = data;
   });

   socket.on('start game', function() {
      console.log('start game');

      if (state != states.lobby) {
         console.error('received start game event when not in lobby state');
         return;
      }

      if (!identifier) {
         console.error('received start game event before identifier');
      }

      state = states.game;

      socket.emit('game loaded');
   });

   socket.on('start stage', function(data) {
      console.log('stage update');

      if (state != states.game) {
         console.error('received start stage event when not in game state');
         return;
      }

      if (!identifier) {
         console.error('received start stage event before identifier');
      }

      gGameState = data;
      socket.emit('stage loaded');
   });

   socket.on('state update', function(data) {
      console.log('state update');

      if (state != states.game) {
         console.error('received state update event when not in game state');
         return;
      }

      if (!identifier) {
         console.error('received state update event before identifier');
      }

      gGameState = data;
   });

   socket.on('complete stage', function() {
      console.log('complete stage');

      if (state != states.game) {
         console.error('received state update event when not in game state');
         return;
      }

      if (!identifier) {
         console.error('received state update event before identifier');
      }

      // complete stage
   });

   socket.on('fail stage', function() {
      console.log('fail stage');

      if (state != states.game) {
         console.error('received state update event when not in game state');
         return;
      }

      if (!identifier) {
         console.error('received state update event before identifier');
      }

      // fail stage
      state = states.lobby;
   });

   $window.on('lobby_join', function(ev, username) {
      console.log('lobby join');

      if (state != states.lobby) {
         console.error('fired lobby join event when not in lobby state');
         return;
      }

      if (!identifier) {
         console.error('fired lobby ready event before identifier');
         return;
      }

      socket.emit('lobby join', {username: username});
   });

   $window.on('lobby_ready', function(ev) {
      console.log('lobby ready');

      if (state != states.lobby) {
         console.error('fired lobby ready event when not in lobby state');
         return;
      }

      if (!identifier) {
         console.error('fired lobby ready event before identifier');
         return;
      }

      socket.emit('lobby ready');
   });

   $window.on('lobby_not_ready', function(ev) {
      console.log('lobby not ready');

      if (state != states.lobby) {
         console.error('fired lobby not ready event when not in lobby state');
         return;
      }

      if (!identifier) {
         console.error('fired lobby not ready event before identifier');
         return;
      }

      socket.emit('lobby not ready');
   });

   $window.on('action_taken', function(ev, action) {
      console.log('action taken');

      if (state != states.game) {
         console.error('fired action taken event when not in game state');
         return;
      }

      if (!identifier) {
         console.error('fired action taken event before identifier');
         return;
      }

      socket.emit('action taken', action);
   });
});
