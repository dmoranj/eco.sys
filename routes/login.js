function showLogin(req, res) {
    res.render('login', { title:'The Eco.Sys login page'});
}

function doAuthentication(req, res) {
    req.session.user = req.body.login;
    res.render('login', { title:'The Eco.Sys login page'});
}

exports.login = showLogin;
exports.authenticate = doAuthentication;