var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
let config = require('config');
//Database setup
var mongo = require('mongodb');
var monk = require('monk');
const db = monk('localhost:27017/KTH-Study-App-DB');

//route objects
var index = require('./routes/index');
var login = require('./routes/login');
var groups = require('./routes/groups');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'private-key',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

//assign db object to the incoming http request
app.use(function(req, res, next) {
  //console.log(req);
  req.db = db;
  next();
});

app.use('/login', login);
//index has to go last as we need to load the login page into the app first

if(config.util.getEnv('NODE_ENV') !== 'test') {
  app.use('/users', users);
  app.use('/groups',requireLogin, groups);
  app.use('/',requireLogin, index);
} else {
  app.use('/users', makeCookieTest, users);
  app.use('/groups',makeCookieTest, groups);
  app.use('/', makeCookieTest, index);
  function makeCookieTest(req, res, next) {
    req.session.user = { 'email' : 'test' };
    next();
  }
}

function requireLogin (req, res, next) {
  if(!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
