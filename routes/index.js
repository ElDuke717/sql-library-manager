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

/* GET Create a new book form.  Renders the new book form */
router.get('/books/new', (req, res) => {
  res.render("books/new-book",  {book: {}, title: "Add a book to the list"});
});

/* POST a new book.  Adds a new book entry to the database.*/
router.post('/books', asyncHandler(async(req, res)=> {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.log('sequelize-validation error!');
      console.log(error.errors[0].message)
      console.log(error.message);
      book = await Book.build(req.body);
      res.render("books/new-book"), {book, error: error.errors, title: "Add a book to the list"}
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
  if (book) {
    res.render("books/show", {book, title:book.title});
  } else {
    res.sendStatus(404);
  }
}));

/* POST Update/Edit an individual book.  Posts the info from the edit book form to the 
database after it has been updated.  Includes validation requirements for the title and the author and will 
trigger an error if the model generates a sequelize validation error*/
router.post("/books/:id/edit", asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
    await book.update(req.body);
    res.redirect("/books/" + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; //make sure the book gets updated
      res.render("books/new-book"), {book, errors: error.errors, title: "Enter A New Book"}
    } else {
      throw error;
    }
  }
}));

/*GET Delete a book form - renders the form to delete the book*/
router.get("/books/:id/delete", asyncHandler(async (req, res)=> {
  const book = await Book.findByPk(req.params.id);
  if(book) {
  res.render("books/delete", { book, title: "Remove this book from the list?"});
  } else {
    res.sendStatus(404);
  }
}));

/*POST Delete a book - implements the delete via book.destroy() */
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
  await book.destroy();
  res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
