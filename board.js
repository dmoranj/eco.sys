var model = require("./model");
var tiles = require("./tiles");
var game = require("./game");
var async = require("async")

var clientManager = require("./routes/clientManager");

function place(gameId, tile) {
    var Game = model.mongoose.model('Game');

    Game.findOne({guid:gameId}, function (err, doc) {

        doc.placedTiles.push(tile);
        tiles.remove(doc, tile);
        game.score(doc, tile);
        game.nextPlayer(doc);

        doc.save(function (err) {
            if (err) {
                console.log("Error placing tile: " + err);
            } else {
                async.map(
                    doc.players,
                    function (data, callback) {
                        callback(null, {
                            score:data.score,
                            name:data.name
                        });
                    },
                    function (err, results) {
                        clientManager.broadcast(doc.guid, "updateGame", {
                            currentPlayer:doc.currentPlayer,
                            scores:results
                        });
                    }
                );
            }
        });
    });
}

exports.placeTile = place;