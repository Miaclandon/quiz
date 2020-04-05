let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let expressValidator = require('express-validator');
let flash = require('express-flash');
let session = require('express-session');
let bodyParser = require('body-parser');

let mysql = require('mysql');
let connection  = require('./lib/db');

let indexRouter = require('./routes/index');
let adminRouter = require('./routes/admin');
let adminTopicRouter = require('./routes/topic');
let adminSubtopicRouter = require('./routes/subtopic');
let adminTestRouter = require('./routes/test');
let adminAddTestRouter = require('./routes/addTest');
let adminAddTestQuestionRouter = require('./routes/addQuestion');
let userReadSubtopicRouter = require('./routes/readSubtopic');
let userAuthRouter = require('./routes/userAuth');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '123456cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(flash());
app.use(expressValidator());

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/adminTopic', adminTopicRouter);
app.use('/adminSubtopic', adminSubtopicRouter);
app.use('/admin/adminTest', adminTestRouter);
app.use('/add-test', adminAddTestRouter);
app.use('/add-test-question', adminAddTestQuestionRouter);
app.use('/user/readSubtopic/(:idSubtopic)', userReadSubtopicRouter);
app.use('/userAuth', userAuthRouter);

//using user routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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