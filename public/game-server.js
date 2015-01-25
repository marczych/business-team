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
var globalTasks;
var lastGlobalTask;
var stageNum;
var numCompletedTasks;
var penalties;

var updatesPerSecond = 5;
function globalTaskChance() { return 60 * 2 * updatesPerSecond(); }

var gameServer = {

   // Lobby
   /////////////////////////////////////////////////////////////////////////

   initializeLobby: function() {
      players = {};
   },

   addPlayer: function(socket) {
      var identifier = uuid.v4();
      socket.identifier = identifier;
      var player = {
         identifier: identifier,
         socket: socket,
         username: getNextUsername(),
         lobbyReady: false,
         gameLoaded: false,
         stageLoaded: false,
         task: undefined,
      };

      return players[identifier] = player;
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
      return Object.keys(players).every(function(identifier) {
         return players[identifier].lobbyReady;
      });
   },

   // Game Play
   /////////////////////////////////////////////////////////////////////////

   initializeGame: function() {
      stageNum = 0;

      Object.keys(players).forEach(function(identifier) {
         players[identifier].gameLoaded = false;
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
      return Object.keys(players).every(function(identifier) {
         return players[identifier].gameLoaded;
      });
   },

   initializeStage: function() {
      panels = {};
      tasks = {};
      globalTasks = {};
      lastGlobalTask = undefined;
      numCompletedTasks = 0;
      penalties = [];

      Object.keys(players).forEach(function(identifier) {
         players[identifier].stageLoaded = false;
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
      return Object.keys(players).every(function(identifier) {
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

   getPlayerCount: function() {
      return Object.keys(players).length;
   },

   play: loop,
};

// Helpers
///////////////////////////////////////////////////////////////////////////////

function rand(min, max) {
   return Math.random() * (max - min) + min;
}

function now() {
   return (new Date().getTime()) / 1000;
}

function actionEquals(a, b) {
   return a == b;
}

var usernames = [
   'Batman',
   'Superman',
   'Wonder Woman',
   'Aqua Man',
   'Shazzam',
   'Green Lantern',
   'Cyborg',
   'Flash',
   'Martial Man Hunter',
];
var lastUsername = 0;
function getNextUsername() {
   return usernames[(lastUsername++) % usernames.length];
}

function waitForPlayers(io) {}
function updateGame(io) {
   if (isStageComplete()) {
      completeStage();
      return;
   }

   if (isStageFailed()) {
      failStage();
      return;
   }

   delegateTasks(io);
   updatePlayersState();
}
function loop() {
   callback(io);
   setTimeout(loop, 1000 / updatesPerSecond);
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

   var playerList = [];
   Object.keys(players).forEach(function(identifier) {
      var player = players[identifier];
      playerList.push({
         identifier: player.identifier,
         username: player.username,
         ready: player.lobbyReady,
      });
   });
   io.emit('lobby list', playerList);

   console.log(gameServer.getPlayerCount() + ' players remain');
}

function onDisconnect(socket) {
   console.log('disconnect');

   if (state == states.lobby) {
      var player = gameServer.removePlayer(socket.identifier);
      socket.broadcast.emit('disconnected', player.identifier)
   } else {
      io.emit('game ended');
      callback = waitForPlayers;
   }

   console.log(gameServer.getPlayerCount() + ' players remain');
}

function onLobbyReady(socket) {
   console.log('lobby ready');

   if (state != states.lobby) {
      console.error('received lobby ready event when not in lobby state');
      return;
   }

   gameServer.setPlayerLobbyReady(socket.identifier);

   if (!gameServer.arePlayersLobbyReady()) {
      return;
   }

   console.log('all lobby ready');

   startGame();
}

function onLobbyNotReady(socket) {
   console.log('lobby not ready');

   if (state != states.lobby) {
      console.error('received lobby not ready event when not in lobby state');
      return;
   }

   gameServer.setPlayerLobbyNotReady(socket.identifier);
}

function onGameLoaded(socket) {
   console.log('game loaded');

   if (state != states.game) {
      console.error('received game loaded event when not in game state');
      return;
   }

   gameServer.setPlayerGameLoaded(socket.identifier);

   if (!gameServer.arePlayersGameLoaded()) {
      return;
   }

   console.log('all game loaded');

   startStage();
}

function onStageLoaded(socket) {
   console.log('stage loaded');

   if (state != states.game) {
      console.error('received stage loaded event when not in game state');
      return;
   }

   gameServer.setPlayerStageLoaded(socket.identifier);

   if (!gameServer.arePlayersStageLoaded()) {
      return;
   }

   console.log('all stage loaded');

   callback = updateGame;
}

function onActionTaken(socket, action) {
   console.log('action taken');

   if (state != states.game) {
      console.error('received action taken event when not in game state');
      return;
   }

   var handled = false;
   Object.keys(players).forEach(function(identifier) {
      var player = players[identifier];
      var task = player.task;

      if (!task || !task.action || !actionEquals(task.action, action)) {
         return;
      }

      console.log('task handled');

      handled = true;
      task.completionDate = now();
      player.task = undefined;
      ++numCompletedTasks
   });

   if (!handled) {
      console.log('task not needed');

      penalties.push({type: 'unneeded', time: now()});
   }
}

// Actions
///////////////////////////////////////////////////////////////////////////////

function startGame() {
   callback = waitForPlayers;
   state = states.game;
   gameServer.initializeGame();
   var gameData = {};

   console.log('starting game');

   io.emit('start game', gameData);
}

function startStage() {
   callback = waitForPlayers;
   gameServer.initializeStage();
   ++stageNum;

   console.log('starting stage');

   updatePlayersState(/* first time */ true);
}

function isStageComplete() {
   return numCompletedTasks >= 5 + (stageNum * 2);
}

function completeStage(results) {
   console.log('complete stage');

   callback = waitForPlayers;
   io.emit('complete stage', results);

   setTimeout(startStage, 2000);
}

function isStageFailed() {
   var nowDate = now();

   var penaltyScores = penalties.map(function(p) {
      var delta = nowDate - p.time;
      var penalty = Math.pow(delta, -0.5);
      return p.type == 'missed' ? delta : /* unneeded */ delta / 4;
   });

   if (!(penaltyScores && penaltyScores.length)) {
      return false;
   }

   return penaltyScores.reduce(function(a, b) { return a + b; }) >= 10;
}

function failStage(results) {
   console.log('fail stage');

   callback = waitForPlayers;
   state = states.lobby;
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
      io.emit('global task', this.getNewGlobalTask());
   }
}

function createNewTask() {
   var identifier = uuid.v4();
   var creationDate = now();
   var expirationDate = creationDate + rand(8, 12);

   var task = {
      identifier: identifier,
      creationDate: creationDate,
      expirationDate: expirationDate,
      completionDate: undefined,
      action: createAction(),
   };

   console.log('create task');
   console.log(task);

   setTimeout(function() {
      if (task.completionDate) {
         return;
      }

      penalties.push({type: 'missed', time: expirationDate});
   }, (expirationDate - creationDate) * 1000);

   return tasks[identifier] = task;
}

function createAction() {
   return 'Put on business socks';
}

function shouldCreateGlobalTask() {
   if (!lastGlobalTask) {
      return false;
   }

   if (lastGlobalTask.expirationDate + 3 <= now()) {
      return false;
   }

   return rand(1, globalTaskChance()) == 1;
}

function createNewGlobalTask() {
   var identifier = uuid.v4();
   var creationDate = now();
   var expirationDate = creationDate + rand(8, 12);

   var globalTask = {
      identifier: identifier,
      creationDate: creationDate,
      expirationDate: expirationDate,
      completionDate: undefined,
      action: createGlobalAction(),
   };

   console.log('create global task');
   console.log(globalTask);

   setTimeout(function() {
      if (globalTask.completionDate) {
         return;
      }

      penalties.push({type: 'missed', time: expirationDate});
   }, (expirationDate - creationDate) * 1000);

   return lastGlobalTask = globalTasks[identifier] = globalTask;
}

function createGlobalAction() {
   return "We're being acquired! Everybody shake!";
}

function updatePlayersState(firstTime) {
   var eventName = firstTime ? 'start stage' : 'state update';
   gameServer.getPlayerStates().forEach(function(playerState) {
      playerState.socket.emit(eventName, playerState.state);
   });
}

module.exports = function(ioConnection) {
   io = ioConnection;

   gameServer.initializeLobby();

   io.on('connection', function(socket) {
      onConnect(socket);

      socket.on('disconnect', function() {
         onDisconnect(socket);
      });

      socket.on('lobby ready', function() {
         onLobbyReady(socket);
      });

      socket.on('lobby not ready', function() {
         onLobbyNotReady(socket);
      });

      socket.on('game loaded', function() {
         onGameLoaded(socket);
      });

      socket.on('stage loaded', function() {
         onStageLoaded(socket);
      });

      socket.on('action taken', function(action) {
         onActionTaken(socket, action);
      });
   });

   return gameServer;
};
