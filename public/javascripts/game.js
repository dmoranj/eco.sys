var Game = function() {

    var colors = [
        "#DDBBBB",
        "#BBDDBB",
        "#BBBBDD",
        "#DDDDBB",
        "#BBDDDD",
        "#CCBBCC"
    ];

    var lastColor=1;
    var assignedColors = {};

    function drawOpponent(name, score) {

        assignedColors[name] = colors[lastColor++];

        var opponentTag = document.createElement("div");
        opponentTag.id = name;
        opponentTag.className = "opponent";
        $("#opponents").append(opponentTag);

        $("#" + name).css("background-color", assignedColors[name]);

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

                if (data.drawnCard && data.drawnCard.owner == $("#player")[0].value) {
                    Hand.add(new Tile(data.drawnCard));
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

                assignedColors[$("#player")[0].value] = colors[0];
                $("#score").css("background-color", colors[0]);

                $("#score").text(data.player.score);
            });
        }
    };
}();