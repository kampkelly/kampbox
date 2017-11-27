var express = require('express');
var reload = require('reload');
var bodyParser = require("body-parser");
var app = express();
var engine = require('ejs-locals');
var io = require('socket.io')();

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');

require('./config/passport')(passport); // pass passport to configuration

app.set('port', process.env.PORT || 3000 );
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

app.locals.sitename = 'YuChat';

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// required for passport
app.use(session({ secret: 'kampbox_messenger', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static('app/public'));
app.use(require('./routes/main-route'));
app.use(require('./routes/chat-route'));
app.use(require('./routes/settings-route'));

reload(app);

var server = app.listen(app.get('port'), function() {
  console.log('Kampbox Messenger listening on port ' + app.get('port'));
});

io.attach(server);
io.on('connection', function(socket) {
	console.log('i am just connected to socket.io');
  socket.on('postMessage', function(data) {
  	console.log('i got postMessage');
    io.emit('updateMessages', data);
  });
  socket.on('newPrivateChat', function(data) {
  	console.log('i got newprivatechat');
    io.emit('detectPrivateChat', data);
  });
});

