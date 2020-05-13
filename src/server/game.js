const Constants = require('../shared/constants');
var Mutex = require('async-mutex').Mutex;

class Game {
    constructor() {
        this.id = 0
        this.circleID = 0
        this.players = new Array();
        this.circles = new Array();
        this.circlesById = new Array();
        this.gameSpecificId = new Array();
        this.color = new Array();
        this.createCenterField();
        this.STARTING_LIFE = 20
        this.ais = new Array();
        this.usernames = new Array();
    }

    createField(){
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++){
                var circle = new Circle(0, -1, this.circleID)
                this.circlesById[this.circleID] = circle
                this.circleID++
                var x = Math.floor(Math.random() * 7 ) + (26 * i)
                var y = Math.floor(Math.random() * 10 )+ (25 * j)
                if (i== 0 && j ==0) {
                    x += 2 
                    y += 2
                }
                circle.setCoordinates(x,y)
                this.circles.push(circle)
            }
        }
    }

    createCenterField(){
        var circle = new Circle(0, -1, this.circleID)
        this.circlesById[this.circleID] = circle
        this.circleID++
        circle.setCoordinates(2,2)
        this.circles.push(circle)
        var circle = new Circle(0, -1, this.circleID)
        this.circlesById[this.circleID] = circle
        this.circleID++
        circle.setCoordinates(Constants.SCALE - 17,Constants.SCALE - 17)
        this.circles.push(circle)
        var circle = new Circle(0, -1, this.circleID)
        this.circlesById[this.circleID] = circle
        this.circleID++
        circle.setCoordinates(2,Constants.SCALE - 17)
        this.circles.push(circle)
        var circle = new Circle(0, -1, this.circleID)
        this.circlesById[this.circleID] = circle
        this.circleID++
        circle.setCoordinates(Constants.SCALE - 17,2)
        this.circles.push(circle)
        for (var i = -1; i < 4; i++) {
            for (var j = 0; j < 3; j++){
                if (i %2 == j%2){
                    var circle = new Circle(0, -1, this.circleID)
                    this.circlesById[this.circleID] = circle
                    this.circleID++
                    var x = (28) + (14 * i)
                    var y = (23) + (20 * j)
                    circle.setCoordinates(x,y)
                    this.circles.push(circle)
                }
                if (i == -1 && j == 1){
                    var circle = new Circle(0, -1, this.circleID)
                    this.circlesById[this.circleID] = circle
                    this.circleID++
                    var x = (28) + (14 * i)
                    var y = (23) + (20 * j)
                    circle.setCoordinates(x,y)
                    this.circles.push(circle)

                }
            }
        }
    }

    setStartingPoints(){
        this.color[-1] = Constants.COLOR.WHITE
        var counted = 0
        var found = false
        for (var key in this.players) {
            found = false
            while (!found){
                const i =  Math.floor(Math.random() * this.circles.length )
                if (this.circles[i].side == -1) {
                    this.circles[i].setSide(key)
                    this.circles[i].setLife(this.STARTING_LIFE)
                    var randomColor = Math.floor(Math.random()*16777215).toString(16);
                    while(randomColor.length != 6) {
                        randomColor = "0" + randomColor 
                    }
                    this.color[key] = randomColor
                    counted++
                    found = true
                } 
            }
            if (counted == this.circles.length){
                break
            }
        }

        found = false
        for (var j in this.ais) {
            found = false
            if (counted == this.circles.length){
                break
            }
            while (!found){
                const i =  Math.floor(Math.random() * this.circles.length )
                if (this.circles[i].side == -1) {
                    var randomColor = Math.floor(Math.random()*16777215).toString(16);
                    this.color[this.ais[j]] = randomColor
                    while(randomColor.length != 6) {
                        randomColor = "0" + randomColor 
                    }
                    this.circles[i].setSide(this.ais[j])
                    this.circles[i].setLife(this.STARTING_LIFE)
                    counted++
                    found = true

                } 
            }
        
        }
        
    }

    getSidedCirclesById (id){
        var all = new Array()
        var owned = new Array()
        for (var key in this.circlesById){
            all.push(key)
            if (this.circlesById[key].side != -1 ){
                if (this.circlesById[key].side.localeCompare(id) == 0){
                    owned.push(key)
                } 
            } else {
                if (id == -1) {
                    owned.push(key)
                } 
            }
        }
        return [all, owned]
    }

    addPlayer(socket, username){
        console.log("added player:" + socket.id);
        this.players[socket.id] = socket
        this.id++
        this.gameSpecificId[socket.id] = this.id
        this.usernames[this.id] = username
        return this.id
    }

    addAi(id, username){
        this.ais.push(id)
        this.id++
        this.gameSpecificId[id] = this.id
        this.usernames[this.id] = username
        return this.id
    }

    removePlayer(socketId){
        delete this.players[socketId]
        delete this.gameSpecificId[socketId]
    }

    updatePlayers(){
        this.timer = setInterval(
            () => {
                this.sendGame()
            },
            50
        );
    }

    handleMove(rect1, rect2, id, fullMove){
        console.log("got move" + rect1 + " " + rect2 +  " " + id)
        if (this.circlesById[rect1] != null) {
            if (this.circlesById[rect1]["side"] != -1){
                if (id.localeCompare(this.circlesById[rect1]["side"]) == 0){

                    var circle1 = this.circlesById[rect1]
                    var circle2 = this.circlesById[rect2]
                    if (circle1 == null || circle2 == null){
                        return
                    }
                    var send
                    if (fullMove){
                        send = Math.floor(circle1["life"])
                    } else {
                        send = Math.floor(circle1["life"]/2)
                    }

                    var x = 0
                    var dist = Constants.calcDistance(circle1["X"], circle2["X"], circle1["Y"], circle2["Y"])
                    var timer = setInterval(
                        (circle1, circle2, send, id) => {
                            if (id != circle1["id"] || circle1["life"] == 0) {
                                clearInterval(timer)
                                return
                            }
                            
                            circle1.decrement(circle1.side)
                            var colorID = this.color[circle1.side]
                            var moveTuple = JSON.stringify([circle1.X, circle2.X, circle1.Y, circle2.Y, colorID])                                        
                            //var moveTuple = JSON.stringify([circle1.id, circle2.id, circle1.side])
        
                            for (var key in this.players) {
                                this.players[key].emit(Constants.MSG_TYPES.ANIMATE,moveTuple)
                            }
                            setTimeout(() => {
                                circle2.increment(circle1.side)
                            }, dist )
                            
                            x++;
                            if (x == send){
                                clearInterval(timer)
                            }
                        },
                        200, circle1, circle2, send, rect1
                    );
                }
    
            }
        } 
    
    }


    sendGame(){
        var circlesPacket = new Array()
        for (var i in this.circles){
            const circle = this.circles[i]
            var packet = new Object();
            packet["life"] = circle.life
            packet["x"] = circle.X
            packet["y"] = circle.Y
            packet["color"] = this.color[circle.side]
            if (circle.side != -1) {
                packet["side"] = this.gameSpecificId[circle.side]
                packet["username"] = this.usernames[this.gameSpecificId[circle.side]]
            } else {
                packet["side"] = -1
            }
            packet["id"] = circle.id
            circlesPacket.push(packet)
        }
        for (var key in this.players) {
            var poop = JSON.stringify(circlesPacket)
            this.players[key].emit(Constants.MSG_TYPES.UPDATE, JSON.stringify(circlesPacket))
        }
    }
}

class Circle {
    constructor(life, side, id){
        this.id = id
        this.life = life
        this.side = side
        this.X = 0
        this.Y = 0
        this.startTicker()
        this.mutex = new Mutex();
    }
    
    startTicker(){
        this.timer = setInterval(
            () => {
                if (this.side != -1){
                    this.life += 1
                }
            },
            1000
        );
    }

    async increment(senderSide){
        const release = await this.mutex.acquire();
 
    
        if (this.side <= -1){
            this.side = senderSide
            this.life++
        } else if (this.side == senderSide){
            this.life++
        } else {
            this.life--
            if (this.life <= 0){
                this.side = -1
                
            } 
        }
        release();
    }

    async decrement(senderSide){
        const release = await this.mutex.acquire();
        if (this.life > 0){
            this.life--
        }
        release();
    }

    setCoordinates(x, y){
        this.X = x
        this.Y = y
    }

    setSide(side){
        this.side = side
    }

    setLife(life){
        this.life = life
    }

    
}




module.exports = Game