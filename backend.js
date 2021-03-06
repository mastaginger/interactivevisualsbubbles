// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);
let numberOfPlayers = 0;
// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static(__dirname + "/public"));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/booth/booth.html');
});

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function

  function (socket) {
    numberOfPlayers++;
    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function (data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y + ` ${data.Emoji}`);

        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
        //

        // socket.broadcast.emit('Blendbutton',BlendMode);
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );
    socket.on('BlendButton',
      function (BlendData) {
        console.log(BlendData);
        // socket.broadcast.emit('BlendButton', BlendData);
        io.sockets.emit('BlendButton', BlendData);


      }
    );
    socket.on('clearButton',
      function (ClearData) {
        console.log(ClearData);
        // socket.broadcast.emit('BlendButton', BlendData);
        io.sockets.emit('clearButton', ClearData);


      }
    );
    socket.on('bgChoice', function (BackData) {
      io.sockets.emit('bgChoice', BackData);
      console.log('fuck');
    });
    socket.on('playerData',
      function (data) {
        console.log(socket.id + ' sent data ' + `${data}`)
        io.emit('playerData', data);
        io.emit('numberOfPlayers', numberOfPlayers);
        console.log(numberOfPlayers);
      }
    );


    socket.on('button', function (mouseIsPressed) {
      console.log(socket.id + 'pressed their mouse') + mouseIsPressed
    });
    socket.on('disconnect', function () {
      console.log("Client has disconnected");
    });
    socket.on('button1', function () {
      console.log(socket.id + ' has pressed the first button')
    });
    socket.on('colorData', function (colordata) {
      console.log(colordata);
      io.emit('colorData', colordata);
    });
  }

);