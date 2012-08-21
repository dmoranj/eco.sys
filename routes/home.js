var model = require("../model");
var utils = require("../utils");
var tiles = require("../tiles");
var async = require("async");

function showHome(req, res) {
    var Game = model.mongoose.model('Game');

    Game.find({}, function (err, docs) {
        res.render('home', {
            title:'The Eco.Sys login page',
            games: docs,
            errorMessage: res.errorMessage,
            infoMessage: res.infoMessage
        });
    });
}

function createGameEntity(title, players) {
    var Game = model.mongoose.model('Game');
    var gameToCreate = new Game();

    gameToCreate.title = title;
    gameToCreate.guid = utils.getUUID();
    gameToCreate.deck = tiles.generateDeck();
    gameToCreate.placedTiles = [];
    gameToCreate.currentPlayer = players[0].trim();
    gameToCreate.state = "PLAYING";

    for (i in players) {
        gameToCreate.players.push({
            name: players[i].trim(),
            score: 0,
            hand: []
        });

        tiles.drawInitialHand(gameToCreate, players[i].trim());
    }

    return gameToCreate;
}

function checkGameRequisites(req, res) {

    var User = model.mongoose.model('User');
    var splittedPlayers = req.body.users.split(",");

    var gameToCreate = createGameEntity(req.body.title, splittedPlayers);

    function checkNickname(nickToFind, mapCallback) {
            mapCallback(null, function (callback) {
                User.findOne({ 'nickname': nickToFind.name }, function (err, docs){
                    if (docs)
                        callback(null, true);
                    else
                        callback(null, false);
                });
            });
    }

    function createGame(err, results) {

        if (err) {
            res.errorMessage= "Error connecting the bd." + err;
            showHome(req, res);
        } else if (results.indexOf(false)>=0) {
            res.errorMessage= "At least one of the players didn't exist.";
            showHome(req, res);
        }else {

            gameToCreate.save(function (err) {
                if (!err)
                    res.infoMessage= "Game created.";
                else
                    res.errorMessage= "Couldn't create game.";

                showHome(req, res);
            });
        }
    }

    async.map(gameToCreate.players, checkNickname, function (err, results) {
            async.parallel(results, createGame);
        }
    );
}

exports.show = showHome;
exports.create = checkGameRequisites;

