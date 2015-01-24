var uuid = require('node-uuid');

// Data
///////////////////////////////////////////////////////////////////////////////

var io;

var states = {
   lobby: {},
   game: {},
   results: {},
};
var state = states.lobby;

var players;
var panels;
var tasks;
var lastGlobalTask;

var gameServer = {

   // Lobby
   /////////////////////////////////////////////////////////////////////////

   initializeLobby: function() {
      players = {};
   },

   addPlayer: function(socket) {
      var identifier = uuid.v4();
      var player = {
         identifier: identifier,
         socket: socket,
         lobbyReady: false,
         gameLoaded: false,
         stageLoaded: false,
         task: undefined,
      };

      return players[identifier] = player;
   },

   removePlayerBySocket: function(socket) {
      var player = undefined;
      Object.keys(players).forEach(function(identifier) {
         if (players[identifier].socket == socket) {
            player = players[identifier];
         }
      });
      if (!player) {
         console.log('player not found');

         return undefined;
      }

      console.log('player found');

      return this.removePlayer(player.identifier);
   },

   removePlayer: function(identifier) {
      var player = players[identifier];
      if (!player) {
         console.error('no player with identifier ' + identifier);
         return;
      }

      delete players[identifier];
      return player;
   },

   setPlayerLobbyReady: function(identifier) {
      var player = players[identifier];
      if (!player) {
         console.error('no player with identifier ' + identifier);
         return;
      }

      player.lobbyReady = true;
   },

   setPlayerLobbyNotReady: function(identifier) {
      var player = players[identifier];
      if (!player) {
         console.error('no player with identifier ' + identifier);
         return;
      }

      player.lobbyReady = false;
   },

   arePlayersLobbyReady: function() {
      Object.keys(players).every(function(identifier) {
         return players[identifier].lobbyReady;
      });
   },

   // Game Play
   /////////////////////////////////////////////////////////////////////////

   initializeGame: function() {
      Object.keys(players).every(function(playerId) {
      });
   },

   setPlayerGameLoaded: function(identifier) {
      var player = players[identifier];
      if (!player) {
         console.error('no player with identifier ' + identifier);
         return;
      }

      player.gameLoaded = true;
   },

   setPlayerGameNotLoaded: function(identifier) {
      var player = players[identifier];
      if (!player) {
         console.error('no player with identifier ' + identifier);
         return;
      }

      player.gameLoaded = false;
   },

   arePlayersGameLoaded: function() {
      Object.keys(players).every(function(identifier) {
         return players[identifier].gameLoaded;
      });
   },

   initializeStage: function() {
      panels = {};
      tasks = {};
      lastGlobalTask = undefined;

      Object.keys(players).forEach(function(identifier) {
         players[identifier].task = undefined;
      });
   },

   setPlayerStageLoaded: function(identifier) {
      var player = players[identifier];
      if (!player) {
         console.error('no player with identifier ' + identifier);
         return;
      }

      player.stageLoaded = true;
   },

   setPlayerStageNotLoaded: function(identifier) {
      var player = players[identifier];
      if (!player) {
         console.error('no player with identifier ' + identifier);
         return;
      }

      player.stageLoaded = false;
   },

   arePlayersStageLoaded: function() {
      Object.keys(players).every(function(identifier) {
         return players[identifier].stageLoaded;
      });
   },

   getPlayerStates: function() {
      var playerStates = [];
      Object.keys(players).forEach(function(identifier) {
         var player = players[identifier];
         playerStates.push({
            socket: player.socket,
            state: {},
         });
      });
      return playerStates;
   },

   play: loop,
};

// Helpers
///////////////////////////////////////////////////////////////////////////////

function rand(min, max) {
   return Math.random() * (max - min) + min;
}

function waitForPlayers(io) {}
function loop() {
   callback(io);
   setTimeout(loop, 200);
}
var callback = waitForPlayers;

// Events
///////////////////////////////////////////////////////////////////////////////

function onConnect(socket) {
   console.log('connection');

   if (state != states.lobby) {
      socket.emit('game in progress');
      return;
   }

   var player = gameServer.addPlayer(socket);
   socket.emit('connected', player.identifier);
}

function onDisconnect(socket) {
   console.log('disconnect');

   if (state == states.game) {
      var player = gameServer.removePlayerBySocket(socket);
      socket.broadcast.emit('disconnected', player.identifier)
   } else {
      io.emit('game ended');
      callback = waitForPlayers;
   }
}

function onLobbyReady(socket, identifier) {
   console.log('lobby ready');

   if (state != states.lobby) {
      return;
   }

   gameServer.setPlayerLobbyReady(identifier);

   if (!gameServer.arePlayersLobbyReady()) {
      return;
   }

   console.log('all lobby ready');

   startGame();
}

function onLobbyNotReady(socket, identifier) {
   console.log('lobby not ready');

   if (state != states.lobby) {
      return;
   }

   gameServer.setPlayerLobbyNotReady(identifier);
}

function onGameLoaded(socket, data) {
   console.log('game loaded');

   if (state != states.game) {
      return;
   }

   gameServer.setPlayerGameLoaded(identifier);

   if (!gameServer.arePlayersGameLoaded()) {
      return;
   }

   console.log('all game loaded');

   startStage();
}

function onStageLoaded(socket, data) {
   console.log('stage loaded');

   if (state != states.game) {
      return;
   }

   gameServer.setPlayerStageLoaded(identifier);

   if (!gameServer.arePlayersStageLoaded()) {
      return;
   }

   console.log('all stage loaded');
   callback = delegateTasks;
}

function onActionTaken(socket, data) {
   console.log('action taken');
}

// Actions
///////////////////////////////////////////////////////////////////////////////

function startGame() {
   callback = waitForPlayers;
   gameServer.initializeGame();
   var gameData = {};
   io.emit('start game', gameData);
}

function startStage() {
   callback = waitForPlayers;
   gameServer.initializeStage();
   var stageData = {};
   io.emit('start stage', stageData);
}

function completeStage(results) {
   callback = waitForPlayers;
   gameServer.initializeStage();
   io.emit('complete stage', results);
}

function failStage(results) {
   callback = waitForPlayers;
   io.emit('fail stage', results);
}

function delegateTasks(io) {
   Object.keys(players).forEach(function(identifier) {
      if (players[identifier].task === undefined) {
         var task = createNewTask();
         players[identifier].task = task;
         players[identifier].socket.emit('delegate task', task);
      }
   });

   if (shouldCreateGlobalTask()) {
      createGlobalTask(io);
   }
};

function createNewTask() {
   var identifier = uuid.v4();
   var creationDate = (new Date().getTime()) / 1000;
   var expirationDate = creationDate + rand(8, 12);
   var action = 'Put on business socks ' + rand(1, 10);

   var task = {
      creationDate: creationDate,
      expirationDate: expirationDate,
      action: action,
   };

   return tasks[identifier] = task;
}

function createGlobalTask(io) {
   var globalTask = this.getNextGlobalTask();
   this.lastGlobalTask = globalTask;
   io.emit('global task', globalTask);
}

function shouldCreateGlobalTask() {
   return false;
}

function getNextGlobalTask() {
   return undefined;
}

function updatePlayersState() {
   gameServer.getPlayerStates().forEach(function(playerState) {
      playerState.socket.emit('state update', playerState.state);
   });
}

module.exports = function(ioConnection) {
   io = ioConnection;

   gameServer.initializeLobby();

   io.on('connection', function(socket) {
      onConnect(socket);

      socket.on('disconnect', function(data) {
         onDisconnect(socket, data);
      });

      socket.on('lobby ready', function(data) {
         onLobbyReady(socket, data);
      });

      socket.on('lobby not ready', function(data) {
         onLobbyNotReady(socket, data);
      });

      socket.on('game loaded', function(data) {
         onGameLoaded(socket, data);
      });

      socket.on('stage loaded', function(data) {
         onStageLoaded(socket, data);
      });

      socket.on('action taken', function(data) {
         onActionTaken(socket, data.identifier, data.action);
      });
   });

   return gameServer;
};