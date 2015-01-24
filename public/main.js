$(function() {
  var $window = $(window);
  var socket = io();

  $window.keydown(function (event) {
     socket.emit('keypress', {
        keyCode: event.keyCode
     });
  });

  socket.on('received keypress', function (data) {
     console.log(data.keyCode);
  });

  socket.on('loop', function (data) {
     console.log('loop', data);
  });
});
