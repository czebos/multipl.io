class AI{
    constructor(type, id) {
        this.TYPE = type
        this.ID = id
        this.gameSpefID
    }

    setGame(game) {
        this.game = game
        this.gameSpefID = this.game.addAi(this.ID, this.ID)
    }

    handleMoves(){
        if (this.TYPE.localeCompare("random") == 0){
            this.randomMoves()
        }
        if (this.TYPE.localeCompare("smart") == 0){
            this.smartMoves()
        }
    }

    randomMoves(){
        var interval = setInterval(() =>{
            var tuple = this.game.getSidedCirclesById(this.ID)
            var choice1 = Math.floor(Math.random() * tuple[0].length)
            var choice2 = Math.floor(Math.random() * tuple[1].length)
            var choice3 = Math.floor(Math.random() * 2)
            var fullMove = false
            if (choice3 == 1) {
                fullMove = true
            }
            this.game.handleMove(tuple[1][choice2], tuple[0][choice1], this.ID, fullMove)

        }, 500)
    }

    smartMoves(){
        var interval = setInterval(() =>{
            var tuple = this.game.getSidedCirclesById(this.ID)
            var tuple2 = this.game.getSidedCirclesById(-1)
            if (tuple2[1].length == 0){
                var idsToChooseFrom = new Array()
                for (var i in this.game.players){
                    if (i.localeCompare(this.ID) != 0){
                        if (this.game.getSidedCirclesById(i)[1].length != 0){
                            idsToChooseFrom.push(i)
                        }
                    } 
                }

                for (var i in this.game.ais){
                    console.log(this.game.ais[i])
                    if (this.game.ais[i].localeCompare(this.ID) != 0){
                        if (this.game.getSidedCirclesById(this.game.ais[i])[1].length != 0){
                            idsToChooseFrom.push(this.game.ais[i])
                        }
                    } 
                }
                if (idsToChooseFrom.length != 0){
                    var randomIdchoice = Math.floor(Math.random() * idsToChooseFrom.length)
                    var theirId = idsToChooseFrom[randomIdchoice]

                    tuple2 = this.game.getSidedCirclesById(theirId)
                    var choice1 = Math.floor(Math.random() * tuple2[1].length)
                    var choice2 = Math.floor(Math.random() * tuple[1].length)
                    this.game.handleMove(tuple[1][choice2], tuple2[1][choice1], this.ID, true)

                }

            } else {
                var choice1 = Math.floor(Math.random() * tuple2[1].length)
                var choice2 = Math.floor(Math.random() * tuple[1].length)
                var choice3 = Math.floor(Math.random() * 2)
                var fullMove = false
                if (choice3 == 1) {
                    fullMove = true
                }
                this.game.handleMove(tuple[1][choice2], tuple2[1][choice1], this.ID, fullMove)
            }

        }, 300)
    }
}


module.exports = AI