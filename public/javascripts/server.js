var Server = function() {
    var socket;
    var server;

    function sendMessage(type, data) {
        socket.emit(type, data);
    }

    function initServer () {
        socket = io.connect(server);
    }

    function listen(event, callback) {
        socket.on(event, callback);
    }

    return {
        init: initServer,
        addListener: listen,
        send: sendMessage,
        setServer: function(server) {
            this.server = server;
        }
    }
}();