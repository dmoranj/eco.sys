var model = require("../model");

function showLogin(req, res) {
    res.render('login', { title:'The Eco.Sys login page'});
}

function doAuthentication(req, res) {
    var User = model.mongoose.model('User');

    User.findOne({ 'email': req.body.login }, function (err, doc) {

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

exports.login = showLogin;
exports.authenticate = doAuthentication;