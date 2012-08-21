var model = require("./model");
var tiles = require("./tiles");
var game = require("./game");
var async = require("async")

var clientManager = require("./routes/clientManager");

function place(gameId, tile) {
    var Game = model.mongoose.model('Game');

    Game.findOne({guid:gameId}, function (err, doc) {

        doc.placedTiles.push(tile);
        oldCard = tiles.remove(doc, tile);
        game.score(doc, tile);

        doc.save(function (err, savedGame) {
            if (err) {
                console.log("Error placing tile: " + err);
            } else {
                newCard = tiles.draw(savedGame, savedGame.currentPlayer);
                game.nextPlayer(savedGame);
                game.check(savedGame);

                savedGame.save(function(err, finalGame) {
                    async.map(
                        finalGame.players,
                        function (data, callback) {
                            callback(null, {
                                score:data.score,
                                name:data.name
                            });
                        },
                        function (err, results) {
                            clientManager.broadcast(finalGame.guid, "updateGame", {
                                currentPlayer:finalGame.currentPlayer,
                                scores:results,
                                drawnCard: newCard,
                                state: finalGame.state,
                                winner: finalGame.winner
                            });
                        }
                    );
                });
            }
        });
    });
}

exports.placeTile = place;