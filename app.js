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
app.set('view engine', 'pug');

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
  // const err = new Error('The page you\re looking for can\'t be found');
  // err.status = 404;
  console.log('404 error handler called');
  res.status(404).render('page-not-found');
  // next(err);
});

//404 handler
app.use((req, res, next) => {
  const err = new Error('The page you\'re looking for can\'t be found');
  err.status = 404;
  console.log('404 error handler called');
  next(err);
});

//renders the page-not-found template
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('page-not-found');
});

app.use((err, req, res, next) => {
  if (err) {
  console.log('Global error handler called', err);
  }
  if (err.status === 404) {
    res.status(404).render('page-not-found', { err });
  } else {
    err.message = err.message || `Oops!  It looks like something went wrong on the server.`;
    res.status(err.status || 500).render('error', { err });
  }
});

//Catch-all error handler
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.status(500);
  res.render('error');
  //res.send("Oops, something went wrong.")
  console.log('There was an error - check out the stack trace for more info.')
});

module.exports = app;
