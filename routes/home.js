var model = require("../model");
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

function checkGameRequisites(req, res) {
    var Game = model.mongoose.model('Game');
    var User = model.mongoose.model('User');

    var gameToCreate = new Game();

    gameToCreate.title = req.body.title;

    var splittedPlayers = req.body.users.split(",");

    var userChecks = [];

    for (i in splittedPlayers) {
        userChecks.push(
            function (callback) {
                User.findOne({ 'nickname': splittedPlayers[i].trim() }, function (err, docs){
                    if (docs)
                        callback(null, true);
                    else
                        callback(null, false);
                });
            }
        );
    }

    function createGame(err, results) {

        if (err) {
            res.errorMessage= "Error connecting the bd." + err;
            showHome(req, res);
        } else if (results.indexOf(false)>=0) {
            res.errorMessage= "At least one of the players didn't exist.";
            showHome(req, res);
        }else {
            for (i in splittedPlayers) {
                gameToCreate.players.push({name: splittedPlayers[i].trim()});
            }

            gameToCreate.save(function (err) {
                if (!err)
                    res.infoMessage= "Game created.";
                else
                    res.errorMessage= "Couldn't create game.";

                showHome(req, res);
            });
        }
    }

    async.parallel(userChecks, createGame);
}

exports.show = showHome;
exports.create = checkGameRequisites;

