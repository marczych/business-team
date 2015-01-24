// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
   console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
   socket.on('keypress', function(data) {
      console.log('keypress', data.keyCode);

      // Send keypresses to all clients.
      socket.emit('received keypress', data);
      socket.broadcast.emit('received keypress', data);
   });

   socket.on('disconnect', function () {
      console.log('disconnect');
   });
});

// The server can send arbitrary events at arbitrary times.
(function loop() {
   // Send to all clients.
   io.emit('loop', 'LOOP');

   setTimeout(loop, 1000);
})();
