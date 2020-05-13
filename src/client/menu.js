var list = new Array()
var selected = 0

export function renderPlayerMenu(packet) {
    document.getElementById('player-menu').innerHTML = ""
    packet = JSON.parse(packet)
    var players = packet[0]
    for (var i = 0; i < players.length; i++) {
        var pane = document.createElement("list-object")
        pane.classList.add("game-list")
        pane.style.animation = "game-listK .4s 1"
        pane.innerHTML = players[i]
        pane.onclick = onSelect
        document.getElementById('player-menu').appendChild(pane);
        list.push(pane)
    }
    document.getElementById("add-ai").style.visibility = "visible"
    document.getElementById("add-ai").style.animation = "add-aiK .4s 1"
    document.getElementById("remove-ai").style.visibility = "visible"
    document.getElementById("remove-ai").style.animation = "remove-aiK .4s 1"
    document.getElementById("start-button").style.visibility = "visible"
    document.getElementById("start-button").style.animation = "start-buttonK .4s 1"
    document.getElementById("back-button-player").style.visibility = "visible"
    document.getElementById("back-button-player").style.animation = "back-buttonK .4s 1"
    document.getElementById("player-menu").style.visibility = "visible"

    document.getElementById("join-button").style.visibility = "hidden"
    document.getElementById("create-button").style.visibility = "hidden"
    document.getElementById("back-button").style.visibility = "hidden"
    document.getElementById("game-menu").style.visibility = "hidden"
    document.getElementById("refresh-button").style.visibility = "hidden"

    document.getElementById("join-button").style.animation = ""
    document.getElementById("create-button").style.animation = ""
    document.getElementById("back-button").style.animation = ""
    document.getElementById("refresh-button").style.animation = ""

} 

export function renderGameMenu(packet) {
    document.getElementById('game-menu').innerHTML = ""
    packet = JSON.parse(packet)
    console.log(packet)
    var games = packet[0]
    for (var i = 0; i < games.length; i++) {
        var pane = document.createElement("list-object")
        pane.classList.add("game-list")
        pane.style.animation = "game-listK .4s 1"
        pane.innerHTML = games[i]
        document.getElementById('game-menu').appendChild(pane);
        pane.onclick = onSelect
        list.push(pane)
    }
    document.getElementById("join-button").style.visibility = "visible"
    document.getElementById("create-button").style.visibility = "visible"
    document.getElementById("back-button").style.visibility = "visible"
    document.getElementById("game-menu").style.visibility = "visible"
    document.getElementById("refresh-button").style.visibility = "visible"

    document.getElementById("add-ai").style.visibility = "hidden"
    document.getElementById("remove-ai").style.visibility = "hidden"
    document.getElementById("start-button").style.visibility = "hidden"
    document.getElementById("back-button-player").style.visibility = "hidden"
    document.getElementById("player-menu").style.visibility = "hidden"

    document.getElementById("join-button").style.animation = "join-buttonK .4s 1"
    document.getElementById("create-button").style.animation = "create-buttonK .4s 1"
    document.getElementById("back-button").style.animation = "back-buttonK .4s 1"
    document.getElementById("refresh-button").style.animation = "refresh-buttonK .4s 1"

    document.getElementById("add-ai").style.animation = ""
    document.getElementById("remove-ai").style.animation = ""
    document.getElementById("start-button").style.animation = ""
    document.getElementById("back-button-player").style.animation = ""

}

export function backToStart(){

    const playMenu = document.getElementById('play-menu');
    const playButton = document.getElementById('play-button');
    const usernameInput = document.getElementById('username-input');

    playButton.style.display = "inline"
    playMenu.style.visibility = "visible"
    playMenu.style.display = "inline"

    document.getElementById("logo").style.visibility = "visible"
    
    usernameInput.style.display = "inline"

    document.getElementById("join-button").style.visibility = "hidden"
    document.getElementById("create-button").style.visibility = "hidden"
    document.getElementById("back-button").style.visibility = "hidden"
    document.getElementById("game-menu").style.visibility = "hidden"
    document.getElementById("refresh-button").style.visibility = "hidden"

    document.getElementById("join-button").style.animation = ""
    document.getElementById("create-button").style.animation = ""
    document.getElementById("back-button").style.animation = ""
    document.getElementById("refresh-button").style.animation = ""
}

export function hideForGame(){

    document.getElementById("add-ai").style.visibility = "hidden"
    document.getElementById("remove-ai").style.visibility = "hidden"
    document.getElementById("start-button").style.visibility = "hidden"
    document.getElementById("back-button-player").style.visibility = "hidden"
    document.getElementById("player-menu").style.visibility = "hidden"

    
}

export function joinPacket(ID){
    var packet = [ID, selected.innerHTML]
    packet = JSON.stringify(packet)
    return packet
}

export function addAIPacket(ID){
    var packet = [ID]
    packet = JSON.stringify(packet)
    return packet
}

export function removeAIPacket(ID){
    var packet = [ID, selected.innerHTML]
    packet = JSON.stringify(packet)
    return packet
}

export function startGamePacket(ID){
    var packet = [ID]
    packet = JSON.stringify(packet)
    return packet
}

export function createGamePacket(ID){
    var packet = [ID]
    packet = JSON.stringify(packet)
    return packet
}

export function leaveRoomPacket(ID){
    var packet = [ID]
    packet = JSON.stringify(packet)
    return packet
}

function onSelect(ev){
    for (var i in list){
        const elem = list[i]
        elem.style.backgroundColor = "black"
        elem.classList.add("game-list")
    }
    ev.srcElement.style.backgroundColor = "#C0C0C0"
    selected = ev.srcElement

}
