
function showGame(req, res) {
    res.render('game', {
        guid: req.params.id,
        player: req.session.user
    });
};



exports.game = showGame;