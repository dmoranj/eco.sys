
function next(game) {
    for (var i=0; i < game.players.length; i++) {
        if (game.players[i].name == game.currentPlayer) {
            game.currentPlayer = game.players[(++i)%game.players.length].name;
        }
    }
}

function scoreTile(game, tile) {
    for (var i=0; i < game.players.length; i++) {
        if (game.players[i].name == game.currentPlayer) {
            game.players[i].score += tile.score;
        }
    }
}

exports.nextPlayer = next
exports.score = scoreTile