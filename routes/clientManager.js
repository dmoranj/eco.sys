var async = require("async");
var model = require("../model");
var board = require("../board");

var clients=[];

function manageConnection (socket) {
    function connectClient(socket) {
        clients.push(socket);
    }

    function disconnectClient(socket) {
        console.log("Client disconnected");
    }

    function placeTile(data) {

        board.placeTile(data.gameId, data.tile);

        async.map(clients, function(client, callback) {
                client.emit('updateBoard', data);
            }
        );
    }

    function initBoard(data) {

        // GET { gameId, playerId }
        var Game = model.mongoose.model('Game');

        Game.findOne({'guid' : data.guid }, function (err, doc) {

            var result= {};

            for (var i in doc.players) {
                if (doc.players[i].name==data.player) {
                    result.player = doc.players[i];
                }
            }

            result.placedTiles = doc.placedTiles;

            socket.emit('initialConfiguration', result);
        });
    }

    connectClient(socket);

    socket.on('init', initBoard);
    socket.on('place', placeTile);
    socket.on('disconnect', disconnectClient);
}

exports.newConnection = manageConnection;
