const express = require('express');
const router = express.Router();
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

/* GET Books listing. */
router.get('/books', asyncHandler( async( req, res) => {
  const books = await Book.findAll();
  res.render("books/books", { books, title: 'Here Are Some Interesting Books' });
  console.log('index route called');
}));

/* Create a new book form. Not working for some reason*/
router.get('/new', (req, res) => {
  res.render("books/new-book",  {book: {}, title: "Enter A New Book"})
});

/* POST a new book*/
router.post('/', asyncHandler(async(req, res)=> {
    const book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  // let book;
  // try {
  //   book = await Book.create(req.body);
  //   res.redirect("/books/" + book.id);
  // } catch (error) {
  //   if (error.name === "SequelizeValidationError") {
  //     book = await Book.build(req.body);
  //     res.render("books/new-book"), {book, errors: error.errors, title: "Enter A New Book"}
  //   } else {
  //     throw error;
  //   }
  // }
}));



module.exports = router;
