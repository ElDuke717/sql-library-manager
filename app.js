const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const {sequelize} = require('./models/index');

(async () => {
  //await db.sequelize.sync({ force: true });
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.log('Unable to sync the database', error);
  }
}
})();

//*******************/
//Set Middleware    /
//******************/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Static route and the express.static method to serve static files - may not be necessary since app.use(express.static(path.join(__dirname, 'public')));  is above
app.use('/static', express.static('public'));

//Error handlers
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  console.log('404 error handler called');
  next(err);
});


// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(createError(404));
});

//renders the page-not-found template
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('page-not-found');
});

// error handler
app.use( (err, req, res, next) => { 
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
