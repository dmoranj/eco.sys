var nodemailer = require("nodemailer"),
    uuid = require('node-uuid'),
    model = require('../model');

var Invitation = model.mongoose.model('Invitation');

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: process.env.GAMES_MAIL_ADDRESS,
        pass: process.env.GAMES_MAIL_PASSWORD
    }
});

var mailOptions = {
    from: "eco.SYS ✔ <clojure.patent.wars@gmail.com>",
    subject: "Register in eco.SYS",
    text: "You are one of the few fortunate mortal beings invited to join the beta of the next game of the century!! And while you wait for that beta, you can enjoy playing eco.SYS :) <BR/></BR> Please click the following link: @{serverUrl}/@{invitationId}/create",
    html: "You are one of the few fortunate mortal beings invited to join the beta of the next game of the century!! And while you wait for that beta, you can enjoy playing eco.SYS :) <BR/></BR> Please click the following link: @{serverUrl}/@{invitationId}/create"
}

function sendInvitation(email, invitationId) {
    mailOptions.to = email;
    mailOptions.html = mailOptions.html.replace("@{invitationId}", invitationId);
    mailOptions.html = mailOptions.html.replace("@{serverUrl}", process.env.GAMES_SERVER_URL);

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    });
}

function generateInvitation(email, callback) {
    var newInvitation = new Invitation();
    newInvitation.guid = uuid.v4();
    newInvitation.email = email;
    newInvitation.availability = new Date((new Date().getTime()) + (15*24*60*60*1000));

    newInvitation.save(callback);
}

function createInvitation(email) {
    generateInvitation(email, function(err, invitation) {
        sendInvitation(email, invitation.guid);
    });
}

function checkInvitation(guid, email) {
    return function(callback) {
        Invitation.findOne({guid: guid, email: email}, function (err, invitation) {
            if (err) {
                callback(err);
            } else if (invitation==null) {
                callback("Invitation or email not found")
            } else {
                callback(null, invitation);
            }
        });
    }
}

exports.send = createInvitation;
exports.check = checkInvitation;