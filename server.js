var util = require("util"),
  io = require("socket.io");
var http = require('http')
var port = process.env.PORT || 1337;
var socket,
  players;
  

function init() {
  players = [];
  setEventHandlers();
};

var setEventHandlers = function() {
  socket.sockets.on("connection", onSocketConnection);
}

function onSocketConnection(client) {
  util.log("New player has connected: "+client.id);
  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("move player", onMovePlayer);
}

function onClientDisconnect() {
  util.log("Player has disconnected: "+this.id);
};
function onNewPlayer(data) {
  
};
function onMovePlayer(data) {
  
};
init();

socket = io.listen(8000);

socket.cofigure(function() {
  socket.set("transports", ["websocket"]);
  socket.set("log level", 2);
})
http.createServer( function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port);
