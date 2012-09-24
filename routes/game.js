var model = require("../model");
var tiles = require("../tiles");

function showGame(req, res) {
    res.render('game', {
        guid: req.params.id,
        player: req.session.user,
        serverUrl: process.env.GAMES_SERVER_URL
    });
};

function drawHand(req, res) {
    var Game = model.mongoose.model('Game');
    var player = req.session.user;
    var gameId = req.params.id;

    Game.findOne({guid: gameId} , function(err, game) {

        if (err) {
            res.json({
                status: "ERROR",
                player: player
            });
        } else {
            tiles.dropHand(game, player);

            game.save(function (err, savedGame) {
                if (err) {
                    console.error("Error dropping hand: " + err);
                } else {
                    tiles.drawInitialHand(game, player);

                    game.save(function (err, savedGame) {
                        if (err) {
                            console.error("Error drawing hand: " + err);
                        } else {
                            var newHand=null;
                            for (var i=0; i < savedGame.players.length; i++) {
                                if (savedGame.players[i].name == player) {
                                    newHand = savedGame.players[i].hand;
                                    break;
                                }
                            }

                            res.json({
                                status: "OK",
                                guid: savedGame.guid,
                                player: player,
                                newHand: newHand
                            });
                        }
                    });
                }
            });
        }
    });
}

exports.game = showGame;
exports.drawNewHand = drawHand;