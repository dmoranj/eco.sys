var model = require("../model");

function showLogin(req, res) {
    res.render('login', { title:'The Eco.Sys login page'});
}

function doAuthentication(req, res) {
    var User = model.mongoose.model('User');

    var foundUser = User.findOne({ 'email': req.body.login }, function (err, doc) {

        if (doc && doc.password==req.body.password) {
            res.render('game', { title:'The Eco.Sys game page'});
        } else {
            req.session.user = req.body.login;

            res.render('login', { errorMessage: 'Wrong username or password'});
        }
    });
}

exports.login = showLogin;
exports.authenticate = doAuthentication;