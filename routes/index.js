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

/* GET home page */
router.get('/', (req, res, next) => {
  res.redirect("/books")
});

/* GET Books listing */
router.get('/books', asyncHandler( async( req, res) => {
  const books = await Book.findAll(
    { order: [["title", "ASC"]]}
    );
  res.render("books/books", { books, title: 'Books We Love 📖'  });
  console.log('index route called');
}));

/* Create a new book form.  Renders the new book form */
router.get('/books/new', (req, res) => {
  res.render("books/new-book",  {book: {}, title: "Enter A New Book"});
});

/* POST a new book.  Adds a new book entry to the database.*/
router.post('/books', asyncHandler(async(req, res)=> {
  // const book = await Book.create(req.body);
  // console.log('a post happened');
  // res.redirect("/books/"+book.id);
  // console.log(req.body);
  let book;
  try {
    console.log('a post happened');   
    console.log(req.body);
    book = await Book.create(req.body);
    res.redirect("/books/"+book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book"), {book, errors: error.errors, title: "Enter A New Book"}
    } else {
      throw error;
    }
  }
}));

/*GET Edit book form - this pulls up the edit book form so book info can be updated*/
router.get("/books/:id/edit", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("books/edit", { book, title: book.title })
  console.log('edit book form');
}));

/* GET individual book. This allows the user to view each individual book's 
info on its own page.  I need to come back and fix the if/else block */
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("books/show", { book, title: book.title }) 
  // if (book) {
  //   res.render("/books/show", {book, title:book.title});
  // } else {
  //   res.sendStatus(404);
  // }
  // res.render("books/show", { book, title: book.title }); 
}));

/* POST Update an individual book.  Posts the info from the edit book form to the 
database after it has been updated*/
router.post("/books/:id/edit", asyncHandler(async (req, res) => {
  console.log('router.post');
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  console.log(req.body, "from line 82");
  console.log('Book Edit called'); 
  //The only way I was able to get this work right was through cancatenation
  res.redirect("/books/" + book.id);
  
  // let book;
  // try {
  //   console.log('editing a book');   
  //   if (book) {
  //   await Book.create(req.body);
  //   res.redirect("/books/"+book.id);
  //   } else {
  //     res.sendStatus(404);
  //   }
  // } catch (error) {
  //   if (error.name === "SequelizeValidationError") {
  //     book = await Book.build(req.body);
  //     book.id = req.params.id; //make sure the book gets updated
  //     res.render("books/new-book"), {book, errors: error.errors, title: "Enter A New Book"}
  //   } else {
  //     throw error;
  //   }
  // }
}));


module.exports = router;
