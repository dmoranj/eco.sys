var model = require("../model"),
    Recaptcha = require('recaptcha').Recaptcha,
    PUBLIC_KEY = process.env.RECAPTCHA_PUBLIC_KEY,
    PRIVATE_KEY = process.env.RECAPTCHA_PRIVATE_KEY;

function showRegister(errorMessage) {
    var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY);

    var renderData = {
        title:'Eco.Sys: User registration page',
        captcha: recaptcha.toHTML()
    };

    if (errorMessage) {
        renderData.errorMessage = errorMessage;
    }

    return function(req, res) {
        res.render('register', renderData);
    }
}

function checkChallenge(req, callback) {
    var data = {
        remoteip:  req.connection.remoteAddress,
        challenge: req.body.recaptcha_challenge_field,
        response:  req.body.recaptcha_response_field
    };

    var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY, data);

    recaptcha.verify(function(success, error_code) {
        callback((success)?null:error_code)
    });
}

function createUser(req) {
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
            console.log('Ooooh ' + err);
    });
}

function addUser(req, res) {
    checkChallenge(req, function(err) {
        if (err) {
            showRegister(err)(req,res);
        } else {
            res.redirect('/login');
        }
    });
}

exports.registerForm = showRegister(null);
exports.register = addUser;

