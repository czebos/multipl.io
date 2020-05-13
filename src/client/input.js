import { sendMove } from './networking';
import {idMap} from './render'

var click = -1;
var holdingShift = false

export function handleClick(rect){
    for (var id in idMap){
        idMap[id].unselect()
    }
    idMap[rect.props.id].select()

    if (click == -1) {
        click = rect.props.id
        console.log(rect.props.id)
    } else {
        if (rect.props.id != click){
            sendMove(click, rect.props.id, holdingShift)
            click = rect.props.id
            
        }
    }
}

document.addEventListener("keydown", handleKeyBoard)
document.addEventListener("keyup", handleKeyUp)

function handleKeyBoard(ev){
    if (ev.which == 17) {
        holdingShift = true
        console.log("sd")
    }
    if (ev.which == 32) {
        click = -1
        for (var id in idMap){
            idMap[id].unselect()
        }
    }
}

function handleKeyUp(ev){
    if (ev.which == 17) {
        holdingShift = false
    }
}
