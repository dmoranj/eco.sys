var Chat = function() {

    function newServerMessage(data) {
        var tileTag = document.createElement("div");
        tileTag.className = "chatEntry";
        tileTag.innerHTML = '<span style="color: ' + Game.getColor(data.player) + '" class="chatPlayer">' + data.player + ':</span> ' + data.chat;
        $("#history").append(tileTag);
        $("#history").scrollTop($("#history")[0].scrollHeight);
    }

    return {
        init: function() {
            Server.addListener("chat", newServerMessage);
            $('#history').toggle(function() {
                $("#chat").stop().animate({
                    "height": "400px"
                }, 200, function() {
                    $("#history").scrollTop($("#history")[0].scrollHeight);
                });
            }, function() {
                $("#chat").stop().animate({
                    "height": "75px"
                }, 200, function() {
                    $("#history").scrollTop($("#history")[0].scrollHeight);
                });
            });
        },

        handle: function(event) {
            if (event.keyCode == 13) {

                Server.send("chat", {
                    chat: $("#chatInput").val(),
                    gameId: $("#guid").val(),
                    player: $("#player").val()
                });

                $("#chatInput").val("");
            }
        }
    }
}();