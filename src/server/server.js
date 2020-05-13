const GameHandler = require('./gameHandler.js');

const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('../../webpack.dev.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');
const app = express();
const Constants = require('../shared/constants');

app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
  } else {
    app.use(express.static('dist'));
  }

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const socketById = new Array();
const gameHandler = new GameHandler(socketById);

// Setup socket.io
const io = socketio(server);

io.on('connection', socket => {
    console.log('Player connected!', socket.id);

    gameHandler.socketById[socket.id] = socket
    gameHandler.addValidPlayer(socket.id)
    socket.emit(Constants.MSG_TYPES.ID, socket.id)

    socket.on(Constants.MSG_TYPES.MOVE, handleMove);
    socket.on(Constants.MSG_TYPES.START_GAME, startGame)
    socket.on(Constants.MSG_TYPES.CREATE_GAME, createGame)
    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame)
    socket.on(Constants.MSG_TYPES.ADD_AI, addAI)
    socket.on(Constants.MSG_TYPES.REMOVE_AI, removeAI)

    socket.on(Constants.MSG_TYPES.CONNECT, setUsername)
    socket.on(Constants.MSG_TYPES.LEAVE_ROOM, leaveRoom)

  });

function setUsername(packet){
  packet = JSON.parse(packet)
  console.log(packet)
  gameHandler.setUsername(packet)

}

function handleMove(rect1, rect2, id, fullMove){
    gameHandler.handleMove([id, rect1, rect2, fullMove])
}

function leaveRoom(packet){
  packet = JSON.parse(packet)
  console.log("recieved leaves")
  console.log(packet)
  gameHandler.leaveRoom(packet)
}

function startGame(packet){
  packet = JSON.parse(packet)
  console.log("recieved start")
  console.log(packet)
  gameHandler.startGame(packet)
}
function createGame(packet){
  packet = JSON.parse(packet)
  console.log("recieved create")
  console.log(packet)
  gameHandler.createGame(packet)
}
function joinGame(packet){
  packet = JSON.parse(packet)
  console.log("recieved join")
  console.log(packet)
  gameHandler.joinGame(packet)
}
function addAI(packet){
  packet = JSON.parse(packet)
  console.log("recieved add")
  console.log(packet)
  gameHandler.addAI(packet)
}
function removeAI(packet){
  packet = JSON.parse(packet)
  console.log("recieved remove")
  console.log(packet)
  gameHandler.removeAI(packet)
}


  