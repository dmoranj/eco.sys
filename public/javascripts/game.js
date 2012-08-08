var Game = function() {

    function drawOpponent(name, score) {
        var opponentTag = document.createElement("div");
        opponentTag.id = name;
        opponentTag.className = "opponent";
        $("#opponents").append(opponentTag);

        var nameTag = document.createElement("div");
        nameTag.className = "name";
        nameTag.innerHTML = name;
        $("#" + name).append(nameTag);

        var scoreTag = document.createElement("div");
        scoreTag.className = "score";
        scoreTag.innerHTML = score;
        $("#" + name).append(scoreTag);
    }

    return {
        init: function() {
            Server.addListener('updateGame', function (data) {
                if (data.currentPlayer == $("#player")[0].value) {
                    Hand.show();
                }

                for (var i=0; i < data.scores.length; i++) {
                    if (data.scores[i].name==$("#player")[0].value) {
                        $("#score").text(data.scores[i].score);
                    } else {
                        $("#" + data.scores[i].name + " > .score").text(data.scores[i].score);
                    }
                }
            });

            Server.addListener('initialConfiguration', function(data) {
                for (var i=0; i < data.opponents.length; i++) {
                    drawOpponent(data.opponents[i].name, data.opponents[i].score);
                }

                $("#score").text(data.player.score);
            });
        }
    };
}();