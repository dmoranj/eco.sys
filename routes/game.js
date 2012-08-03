exports.game = function (req, res) {
    res.render('game', {
        guid: req.params.id,
        player: req.session.user
    });
};