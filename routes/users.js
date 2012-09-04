var model = require("../model"),
    Recaptcha = require('recaptcha').Recaptcha,
    PUBLIC_KEY = process.env.RECAPTCHA_PUBLIC_KEY,
    PRIVATE_KEY = process.env.RECAPTCHA_PRIVATE_KEY,
    invitations = require("../services/invitationService"),
    async= require("async");

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
        renderData.invitationId = req.params.invitationId;
        res.render('register', renderData);
    }
}

function checkChallenge(req) {
    return function(callback) {
        var data = {
            remoteip:  req.connection.remoteAddress,
            challenge: req.body.recaptcha_challenge_field,
            response:  req.body.recaptcha_response_field
        };

        var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY, data);

        recaptcha.verify(function(success, error_code) {
            callback((success)?null:error_code)
        });
    };
}

function checkUser(email) {
    return function (callback) {
        var User = model.mongoose.model('User');

        User.findOne({email: email}, function(err, user) {
            if (err) {
                callback(err, null);
            } else if (user==null) {
                callback(null, "Valid user");
            } else {
                callback("The user already exists");
            }
        });
    };
}

function createUser(data) {
    return function(callback) {
        var User = model.mongoose.model('User');
        var userToRegister = new User();

        userToRegister.name = data.name;
        userToRegister.surname = data.surname;
        userToRegister.email = data.email;
        userToRegister.password = data.password;
        userToRegister.nickname = data.nickname;
        userToRegister.save(callback);
    };
}

function addUser(req, res) {
    var endFunction = function(err, results) {
        if (err) {
            showRegister(err)(req,res);
        } else {
            res.redirect('/login');
        }
    }

    async.series([
        checkChallenge(req),
        invitations.check(req.params.invitationId, req.body.email),
        checkUser(req.body.email),
        createUser(req.body)
    ], endFunction);
}

exports.registerForm = showRegister(null);
exports.register = addUser;

