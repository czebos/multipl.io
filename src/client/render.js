import React from 'react';
import ReactDOM from 'react-dom';

import  {Circle} from './circle.js';

export var ID = -1;
export var idMap = new Array();
var colorMap = new Array();

var renderedColors = false

export function renderMap(packet){
    const new_packet = JSON.parse(packet)

    var list = new Array();
    if (idMap.length == 0){
        for (var i in new_packet){
            var circle = new_packet[i]
            var color = "#"+ circle["color"]

            const visual = <Circle id = {circle["id"]} ref= {ref => this.reference = ref} startingLife = {circle['life']} originalColor={color} X={circle["x"]} Y={circle["y"]} />;
            var pane = document.createElement("p")
            document.getElementById('renderedGame').appendChild(pane);
            ReactDOM.render(
                visual,
                pane
            );

            idMap[circle["id"]] = this.reference
            list.push(visual)

            if (circle["username"] != null){
                colorMap[circle["username"]] = color
            }
           

        }
        if (!renderedColors){
            renderPlayerBoard()
        }
        renderedColors = true

    } else {
        for (var i in new_packet){
            var circle = new_packet[i]
            const visual = idMap[circle["id"]]

            var color = "#"+ circle["color"]

            visual.setState({color: color})
            visual.setLife(circle["life"])
        }
    }
}

export function setID(id){
    ID = id
    console.log(ID)
}

var zIndex = 0
function renderPlayerBoard(){
    document.getElementById("players-playing").style.display = "flex"
    for (var user in colorMap){
        var player = document.createElement("player")
        player.classList.add("players-in-game")
        player.innerHTML = user
        player.style.color = colorMap[user]
        player.style.display = "block"
        player.style.float = "left"

        document.getElementById('players-playing').appendChild(player)
    }
}
