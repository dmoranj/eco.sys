var model = require("../model");

function showRegister(req, res) {
    res.render('register', { title:'Eco.Sys: User registration page'});
}

function addUser(req, res) {
    var User = model.mongoose.model('User');
    var userToRegister = new User();

    userToRegister.name = req.body.name;
    userToRegister.surname = req.body.surname;
    userToRegister.email = req.body.email;
    userToRegister.password = req.body.password;
    userToRegister.nickname = req.body.nickname;


    userToRegister.save(function (err) {
        if (!err)
            console.log('Success!');
        else
            console.log('Ooooh' + err);
    });

    res.redirect('/login');
}

exports.registerForm = showRegister;
exports.register = addUser;

