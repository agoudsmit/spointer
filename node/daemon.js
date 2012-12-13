var PORT = 8080;

var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

app.use(express.bodyParser());

function handler (req, res) {
  // If there is url encoded data and there is 'data' in the params, emit the
  // changes to everybody
  if (req.body && req.body.data) io.sockets.emit('message', req.body.data);
  res.send(200);
}

app.post('/', handler);
app.listen(PORT);
