var model = require("./model");
var tiles = require("./tiles");

function place(gameId, tile) {
    var Game = model.mongoose.model('Game');

    Game.findOne({guid: gameId}, function (err, doc) {
        doc.placedTiles.push(tile);
        tiles.remove(doc, tile);
        doc.save(function (err) {
            if (err)
                console.log("Error placing tile: " + err);
        });
    });
}

exports.placeTile= place;