import io from 'socket.io-client';
import {renderMap, setID} from "./render"
import {myMove} from "./animate"
import {renderGameMenu, renderPlayerMenu, hideForGame} from "./menu"

const Constants = require('../shared/constants');
const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';

var socket;

export var ID

export const connect = () => {

  socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

  const connectedPromise = new Promise(resolve => {
      socket.on('connect', () => {
        console.log('Connected to server!');
        resolve();
      });
  });



    connectedPromise.then(() => {
      socket.on(Constants.MSG_TYPES.UPDATE, renderMap);
      socket.on(Constants.MSG_TYPES.HIDE_MENU, hideMain)
      socket.on(Constants.MSG_TYPES.ANIMATE, myMove)
      socket.on(Constants.MSG_TYPES.GAME_MENU, renderGameMenu)
      socket.on(Constants.MSG_TYPES.PLAYER_MENU, setGameIDandRenderPlayers)
      socket.on(Constants.MSG_TYPES.ID, play)
    })
};

function hideMain(){
  hideForGame()
}

function setGameIDandRenderPlayers(packet){
  var gameID = JSON.parse(packet)[1]
    if (gameID != -1){
      setID(gameID)
    }
    renderPlayerMenu(packet)
}

export function getID(){
  return ID
}

export function play (id) {
  ID = id
  var username = document.getElementById('username-input').value
  var packet = JSON.stringify([ID, username])
  socket.emit(Constants.MSG_TYPES.CONNECT, packet);
};

export const sendMove = (rect1,rect2, holdingShift) => {
  socket.emit(Constants.MSG_TYPES.MOVE, rect1, rect2, socket.id, holdingShift);
}

export const joinGame = (packet) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, packet);
}; 

export const leaveRoom = (packet) => {
  socket.emit(Constants.MSG_TYPES.LEAVE_ROOM, packet);
}; 


export const addAI = (packet) => {
  socket.emit(Constants.MSG_TYPES.ADD_AI, packet);
}; 

export const removeAI = (packet) => {
  socket.emit(Constants.MSG_TYPES.REMOVE_AI, packet);
};

export const startGame = (packet) => {
  socket.emit(Constants.MSG_TYPES.START_GAME, packet);
}; 

export const createGame = (packet) => {
  socket.emit(Constants.MSG_TYPES.CREATE_GAME, packet);
}; 
