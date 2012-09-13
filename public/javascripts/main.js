$(document).ready(function (){

    Server.init();
    Game.init();
	GameBoard.init();
    Chat.init();

    $("#chatInput").keypress(Chat.handle);
});