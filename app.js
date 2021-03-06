
/**
 * Module dependencies.
 */

var express = require('express')
  , gameMod = require('./routes/game')
  , login = require('./routes/login')
  , users = require('./routes/users')
  , home = require('./routes/home')
  , clientManager = require('./routes/clientManager')
  , io = require('socket.io')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var MemoryStore = express.session.MemoryStore,
    sessionStore = new MemoryStore();

var app = express();

var logFile = fs.createWriteStream('./express.log', {flags: 'a'});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger({stream: logFile}));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat"}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Middleware
//--------------------------------------------------------------------------------
function requiresLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// List of routes
//--------------------------------------------------------------------------------
app.get('/', requiresLogin, home.show);
app.get('/home', requiresLogin, home.show);
app.post('/home', requiresLogin, home.create);

// Authentication
app.get('/login', login.login);
app.post('/login', login.authenticate);
app.get('/logout', login.logout);

// User management
app.get('/users/:invitationId/register', users.registerForm);
app.post('/users/:invitationId/register', users.register);

// Gameplay
app.get('/game/:id', requiresLogin, gameMod.game);
app.post('/game/:id/action/drawHand', requiresLogin, gameMod.drawNewHand);



// Start the servers
//--------------------------------------------------------------------------------
var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


var webSocket = io.listen(httpServer);
webSocket.set('log level', 1)

webSocket.sockets.on('connection', clientManager.newConnection);