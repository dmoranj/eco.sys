function showRegister(req, res) {
    res.render('register', { title:'Eco.Sys: User registration page'});
}

function addUser(req, res) {
    res.render('register', { title:'Eco.Sys: User registration page'});
}

exports.registerForm = showRegister;
exports.register = addUser;

