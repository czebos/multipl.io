const Game = require('./game.js');
const AI = require('./ai.js');
const Constants = require('../shared/constants');


class GameHandler {
    constructor(sockets) {
        this.socketById = sockets
        this.validPlayers = new Array()
        this.inGame = new Array()
        this.gamesByID = new Array()
        this.gameOwner = new Array() 
        this.usernamesByID = new Array()
        this.aiByGame = new Array();
        this.minion = 1
    }

    startGame(packet){
        var ID = packet[0]

        if (this.gameOwner[ID] != null) {
            if (this.inGame[ID] != null && this.validPlayer(ID) && this.gameOwner[ID].localeCompare( this.inGame[ID]) == 0) {
                var gameKey = this.gameOwner[ID]
                var game = this.gamesByID[gameKey]

                for (var key in game.players) {
                    game.players[key].emit(Constants.MSG_TYPES.HIDE_MENU)
                }
                
                var gameKey = this.inGame[ID]
                var game = this.gamesByID[gameKey]
                for (var i in this.aiByGame[gameKey]){
                    var ai = this.aiByGame[gameKey][i]
                    ai.setGame(game)
                }
    

                game.setStartingPoints()
                game.sendGame()
                game.updatePlayers()

                for (var i in this.aiByGame[gameKey]){
                    var ai = this.aiByGame[gameKey][i]
                    ai.handleMoves()
                }
    
                delete this.gameOwner[ID]
            }
        }
    }

    createGame(packet){
        var ID = packet[0]
        if (this.inGame[ID] == null && this.validPlayer(ID) && this.gameOwner[ID] == null) {
            var game = new Game()
            if (this.usernamesByID[ID] == null){
                return
            }
            var gameKey = this.usernamesByID[ID] + "\'s game"
            this.gamesByID[gameKey] = game
            this.gameOwner[ID] = gameKey

            var packet = new Array()
            var games = new Array()
            for (var key in this.gameOwner){
                var gameKey = this.gameOwner[key]
                games.push(gameKey)
            }
            packet.push(games)
            packet = JSON.stringify(packet)

            this.socketById[ID].emit(Constants.MSG_TYPES.GAME_MENU, packet)
        }
    }

    joinGame(packet){
        var ID = packet[0]
        var gameKey = packet[1]
        if (this.inGame[ID] == null && this.validPlayer(ID)) {
            if (this.gamesByID[gameKey] == null){
                return
            } else {
                var game = this.gamesByID[gameKey]
                if (this.socketById[ID] == null) {
                    return
                } 
                this.inGame[ID] = gameKey
                var game = this.gamesByID[gameKey]
                var id = game.addPlayer(this.socketById[ID], this.usernamesByID[ID])

                var packet = new Array()
                var people = new Array()
                for (var key in game.players){
                    var username = this.usernamesByID[key]
                    people.push(username)
                }
                packet.push(people)
                packet.push(id)
                var newPacket = JSON.stringify(packet)
                this.socketById[ID].emit(Constants.MSG_TYPES.PLAYER_MENU, newPacket)

                this.updateEveryone(gameKey)
               
            }

        }
    }

    addAI(packet){
        var ID = packet[0]
        
        if (this.gameOwner[ID] != null) {
            if (this.inGame[ID] != null && this.validPlayer(ID) && this.gameOwner[ID].localeCompare( this.inGame[ID]) == 0) {
                var aiID = "AI " + Math.random().toString(36).substring(2, 5)
                var ai = new AI("smart", aiID)
                var gameKey = this.gameOwner[ID]
                if (this.aiByGame[gameKey] == null) {
                    var list = new Array()
                    list.push(ai)
                    this.aiByGame[gameKey] = list
                } else {
                    this.aiByGame[gameKey].push(ai)
                }
                this.updateEveryone(gameKey)


            }
        }
    }

    removeAI(packet){
        var ID = packet[0]
        var person = packet[1]
        if (this.gameOwner[ID] != null) {
            if (this.inGame[ID] != null && this.validPlayer(ID) && this.gameOwner[ID].localeCompare( this.inGame[ID]) == 0) {
                
                var gameKey = this.inGame[ID]
                var game = this.gamesByID[gameKey]

                for (var socketId in this.usernamesByID){
                    if (this.usernamesByID[socketId].localeCompare(person) == 0){
                        game.removePlayer(socketId)
                        this.inGame[socketId] = null
                        
                        var packet = new Array()
                        var games = new Array()
                        for (var key in this.gameOwner){
                            var gameKey = this.gameOwner[key]
                            games.push(gameKey)
                        }
                        packet.push(games)
                        packet = JSON.stringify(packet)

                        this.socketById[socketId].emit(Constants.MSG_TYPES.GAME_MENU, packet)
                    }
                }
                for (var i in this.aiByGame[gameKey]){
                    if (this.aiByGame[gameKey][i].ID.localeCompare(person) == 0){
                       delete this.aiByGame[gameKey][i]
                       if (this.aiByGame[gameKey].length == 0){
                        this.aiByGame[gameKey] = null
                       }
                    }
                }

                this.updateEveryone(gameKey)
            }
        }
    }

    handleMove(packet){
        var ID = packet[0]
        if (this.inGame[ID] == null){
            return
        } else {
            var gameKey = this.inGame[ID]
            var game = this.gamesByID[gameKey]
            if (packet[1] != null && packet[2] != null && ID != null && packet[3] != null){
                game.handleMove(packet[1], packet[2], ID, packet[3])
            }
        }

    }

    setUsername(packet) {
        var ID = packet[0]
        if (packet[1].localeCompare("") == 0){
            packet[1] = "Conrad's " + this.minion + "th Minion" 
            this.minion++
        }
        this.usernamesByID[packet[0]] = packet[1]

        var packet = new Array()
        var games = new Array()
        for (var key in this.gameOwner){
            var gameKey = this.gameOwner[key]
            games.push(gameKey)
        }
        packet.push(games)
        packet = JSON.stringify(packet)

        this.socketById[ID].emit(Constants.MSG_TYPES.GAME_MENU, packet)

    }

    validPlayer(ID){
        return this.validPlayers[ID] == true
    }

    addValidPlayer(ID){
        this.validPlayers[ID] = true
    }

    leaveRoom(packet){
        var ID = packet[0]
        if (this.inGame[ID] != null && this.validPlayer(ID)) {
            this.inGame[ID] = null
        }
    }

    updateEveryone(gamekey){
        var packet = new Array()
        var people = new Array()
        var game = this.gamesByID[gamekey]
        for (var key in game.players){
            var username = this.usernamesByID[key]
            people.push(username)
        }
        if (this.aiByGame[gamekey] != null) {
            for (var i in this.aiByGame[gamekey]){
                people.push(this.aiByGame[gamekey][i].ID)
            }

        }
        packet.push(people)
        packet.push(-1)
        packet = JSON.stringify(packet)

        for (var key in game.players){
            this.socketById[key].emit(Constants.MSG_TYPES.PLAYER_MENU, packet)
        }
    }


}

module.exports = GameHandler