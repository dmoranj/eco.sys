var model = require("./model");
var tiles = require("./tiles");
var game = require("./game");
var clientManager = require("./routes/clientManager");

function place(gameId, tile) {
    var Game = model.mongoose.model('Game');

    Game.findOne({guid: gameId}, function (err, doc) {

        doc.placedTiles.push(tile);
        tiles.remove(doc, tile);
        game.nextPlayer(doc);

        doc.save(function (err) {
            if (err)
                console.log("Error placing tile: " + err);
            else
                clientManager.broadcast(doc.guid, "updateGame", {
                    currentPlayer: doc.currentPlayer
                });
        });
    });
}

exports.placeTile= place;