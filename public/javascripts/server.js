var Server = function() {
    var socket;

    function sendMessage(type, data) {
        socket.emit(type, data);
    }

    function initServer () {
        socket = io.connect('http://localhost');
    }

    function listen(event, callback) {
        socket.on(event, callback);
    }

    return {
        init: initServer,
        addListener: listen,
        send: sendMessage
    }
}();