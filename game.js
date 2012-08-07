
function next(game) {
    for (var i=0; i < game.players.length; i++) {
        if (game.players[i].name == game.currentPlayer) {
            game.currentPlayer = game.players[(++i)%game.players.length].name;
        }
    }
}

exports.nextPlayer = next