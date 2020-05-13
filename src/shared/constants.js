module.exports = Object.freeze({
    MSG_TYPES: {
      CONNECT: 'connect_game',
      CONFIRM: 'confirm',
      UPDATE: 'update',
      MOVE: "move",
      ID: "id",
      ANIMATE: "animate",
      GAME_MENU: "game_menu",
      PLAYER_MENU: "player_menu",
      START_GAME: "start_game",
      CREATE_GAME: "create_game",
      JOIN_GAME: "join_game",
      ADD_AI: "add_ai",
      REMOVE_AI: "remove_ai",
      LEAVE_ROOM: "leave_room",
      HIDE_MENU: "hide_menu"

    },

    COLOR: {
        BLUE: "#0000FF",
        RED: "#FF0000",
        WHITE: "c0c0c0"
    },

    SCALE: 100,

    toAcutalLoc: (x, y) => {
        var rect = document.getElementById('full-container').getBoundingClientRect()
        var X = x/ 100 * rect.width
        var Y = y/ 100 * rect.height
        return [X,Y]
    }, 

    calcDistance : (x1, x2, y1, y2) => {
        const xDist = Math.abs(x1 - x2)
        const yDist = Math.abs(y1 - y2)
        return (Math.pow(Math.pow(xDist,2) + Math.pow(yDist,2), .7)) * 10
    },
  });