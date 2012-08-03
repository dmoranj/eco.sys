var async = require("async");

var clients=[];

function connectClient(socket) {
    console.log("Client connected");

    clients.push(socket);
}

function disconnectClient(socket) {
    console.log("Client disconnected");
}

function placeTile(data) {
    console.log(data);

    async.map(clients, function(client, callback) {
            client.emit('updateBoard', data);
        }
    );
}

function manageConnection (socket) {
    connectClient(socket);

    //socket.emit('news', { hello: 'world' });
    socket.on('place', placeTile);

    socket.on('disconnect', disconnectClient);
}

exports.newConnection = manageConnection;