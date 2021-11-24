var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler( async( req, res) => {
  const books = await Book.findAll();
   //res.render('index', { title: 'Express' });
   res.json(books.map(book => book.toJSON()));
   console.log(books.map(book => book.toJSON()));
}));


module.exports = router;
