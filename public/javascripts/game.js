var Game = function() {

    return {
        init: function() {
            Server.addListener('updateGame', function (data) {
                if (data.currentPlayer == $("#player")[0].value) {
                    Hand.show();
                }
            });
        }
    };
}();