import { connect, play, joinGame, addAI, removeAI, startGame, createGame, getID, leaveRoom} from './networking';
import {joinPacket, addAIPacket, removeAIPacket, startGamePacket, createGamePacket, backToStart, leaveRoomPacket, hideForGame} from "./menu.js"

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

startClientGame()
startButtons()

function startClientGame(){
    playButton.onclick = () => {
        playButton.style.display = "none"
        playMenu.style.visibility = "hidden"
        playMenu.style.display = "none"
        

        document.getElementById("logo").style.visibility = "hidden"
        usernameInput.style.display = "none"

        connect()
    }
}

function startButtons(){
    document.getElementById('join-button').onclick = () => {
        console.log(getID())
        var packet = joinPacket(getID())
        joinGame(packet)
    }

    document.getElementById('add-ai').onclick = () => {
        var packet = addAIPacket(getID())
        addAI(packet)
    }

    document.getElementById('remove-ai').onclick = () => {
        var packet = removeAIPacket(getID())
        removeAI(packet)
    }

    document.getElementById('start-button').onclick = () => {
        var packet = startGamePacket(getID())
        startGame(packet)
    }

    document.getElementById('back-button-player').onclick = () => {
        play(getID())
        var packet = leaveRoomPacket(getID())
        leaveRoom(packet)
    }

    document.getElementById('create-button').onclick = () => {
        var packet = createGamePacket(getID())
        createGame(packet)
    }

    document.getElementById('back-button').onclick = () => {
        backToStart()
    }

    document.getElementById('refresh-button').onclick = () => {
        play(getID())
    }

}
