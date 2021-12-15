//Express and Sequelize modules
const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('../models').Sequelize;
//Op is imported so that we can use Sequelize's operators
const Op = Sequelize.Op

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

//Determines the books per page to render
const booksPerPage = 15;
/*showBook replaces the async Book.findAll method in the home route to enable search with pagination.  
It is called by the GET books request and renders the books to the main page. 
showBook is called by the search and the main index/books route and has two default settings, blank searchTerm 
and start on page 1*/
async function showBook(searchTerm = '', page = 1) {
  console.log('showBook called');
  /* findAndCountAll is used to replace findAll since it combines findAll and count. 
  This is useful when dealing with queries related to pagination where you want to retrieve 
  data with a limit and offset but also need to know the total number of records that match the query.
  -rows is the specific Book entries on the page. 
 - count is the total number of entries in the database 
 */
  let { rows, count } = await Book.findAndCountAll({
      where: {
        //Op.or allows the searchTerm to be used for any details associated with a book.
        [Op.or]: {
          title: {
            //return a title like what's in the searchTerm - the term entered into the search input field.
            [Op.like]: `%${searchTerm}%`
          },
          author: {
            [Op.like]: `%${searchTerm}%`
          },
            genre: {
            [Op.like]: `%${searchTerm}%`
          },
          year: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      },
      //order is an option that organizes the returned Books by title in ascending order
      order: [
        ["title", "ASC"]
      ],
      //limit specifies the number Books to be rendered to the books page - in this case, booksPerPage
      limit: booksPerPage,
      //offset specifies the number the jump or section of Books to be returned from the database
      offset: (page-1) * booksPerPage
  })
  //determines the number of pages that will be used in pagination, divides the count by the specifed number of books.
  const bookPages = Math.ceil(count / booksPerPage)
  //showBooks returns an object with bookPages (how many pages to render) and books is the books provided by rows.
  return { bookPages, books: rows }
}

/*GET Search books*/
router.get('/books/search', asyncHandler(async(req, res) => {
  console.log('search route called');
  //req.query.searchTerm is the searchTerm attached ot the request object
  console.log(req.query.searchTerm);
  let searchTerm = req.query.searchTerm.toLowerCase() || '';
  const page = req.query.page || 1;
  console.log(`This is the search route, looking for "${searchTerm}", on page ${page}`);
  const { books, bookPages } = await showBook(searchTerm, page)
  console.log(books.map(book => book.toJSON().title.slice(0,10))); //returns a list of the titles, as a check. .slice() method added to shorten
  res.render('books/books', { books, bookPages, page, searchTerm, title: `Search results for "${searchTerm}":`})
}))

/* GET redirect to home page */
router.get('/', (req, res, next) => {
  res.redirect("/books")
});

/* GET Books listing homepage - shows all books */
router.get('/books', asyncHandler( async( req, res) => {
  //if no page is specified, then the default is 1.
  const page = req.query.page || 1;
  console.log('requested page: ', page);
  //books and bookPages are returned from showBook
  const { books, bookPages } = await showBook('', page) 
  console.log(books.map(book => book.toJSON().title.slice(0,10))); //returns a list of the titles, as a check. .slice() method added to shorten
  //renders the books view in the books folder, pulling in books and bookPages from showBook.
  res.render("books/books", { books, bookPages, page, title: 'The Booklist 📖'  });
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
      book = await Book.build(req.body);
      res.render("books/new-book", {book, error: error.errors, title: "Add a book to the list"});
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
info on its own page.  */
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id); //req.params.id contains the book's unique id number
  if (book) {
    res.render("books/show", {book, title:book.title});
  } else {
    //res.sendStatus(404);
    res.render('page-not-found');
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
      res.render("books/edit", {book, error: error.errors, title: "Enter A New Book"});
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
