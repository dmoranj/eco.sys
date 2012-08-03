var model = require("../model");

function showLogin(req, res) {
    res.render('login', { title:'The Eco.Sys login page'});
}

function doAuthentication(req, res) {
    var User = model.mongoose.model('User');

    User.findOne({ 'nickname': req.body.login }, function (err, doc) {

        if (doc && doc.password==req.body.password) {
            req.session.user = req.body.login;

            res.redirect('/home');

        } else {
            res.render('login', {
                title:'The Eco.Sys login page',
                errorMessage: "Wrong user or password"
            });
        }
    });
}

function cleanAuthentication(req, res) {
    delete req.session.user;

    res.redirect('/login');
}

exports.login = showLogin;
exports.authenticate = doAuthentication;
exports.logout = cleanAuthentication;