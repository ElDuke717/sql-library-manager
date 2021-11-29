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
router.get('/', (req, res, next) => {
  res.redirect("/books")
});

/* GET Books Listing. */
router.get('/books', asyncHandler( async( req, res) => {
  const books = await Book.findAll();
  res.render("books/index", { books, title: 'Books' });
  console.log('index route called');
}));




module.exports = router;
