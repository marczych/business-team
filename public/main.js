$(function() {
   var $window = $(window);
   var socket = io();
   var identifier = undefined;
   var states = {
      lobby: {},
      game: {},
      results: {},
   };
   var state;

   $(document).ready(function() {
      state = states.lobby;
   });

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

      // load game things
      socket.emit('game loaded', identifier);
   });

   socket.on('start stage', function() {
      console.log('stage update');

      if (state != states.state) {
         console.error('received start stage event when not in game state');
         return;
      }

      if (!identifier) {
         console.error('received start stage event before identifier');
      }

      // load stage things
      socket.emit('stage loaded', identifier);
   });

   socket.on('state update', function() {
      console.log('state update');

      if (state != states.state) {
         console.error('received state update event when not in game state');
         return;
      }

      if (!identifier) {
         console.error('received state update event before identifier');
      }

      // update state
   });

   $window.bind('lobby ready', function(ev) {
      console.log('lobby ready');

      if (state != states.lobby) {
         console.error('fired lobby ready event when not in lobby state');
         return;
      }

      if (!identifier) {
         console.error('fired lobby ready event before identifier');
         return;
      }

      socket.emit('lobby ready', identifier);
   });

   $window.bind('lobby not ready', function(ev) {
      console.log('lobby not ready');

      if (state != states.lobby) {
         console.error('fired lobby not ready event when not in lobby state');
         return;
      }

      if (!identifier) {
         console.error('fired lobby not ready event before identifier');
         return;
      }

      socket.emit('lobby not ready', identifier);
   });

   $window.bind('action taken', function(ev) {
      console.log('action taken');

      if (state != states.game) {
         console.error('fired action taken event when not in game state');
         return;
      }

      if (!identifier) {
         console.error('fired action taken event before identifier');
         return;
      }

      socket.emit('action taken', {
         identifier: identifier,
         action: ev,
      });
   });
});
