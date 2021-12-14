 'use strict'

// ------------------------------------------
//  GLOBAL VARIABLES
// ------------------------------------------

const searchButton = document.getElementById('search-submit');
const bookTable = document.querySelector('.book-table');
const bookItem = document.querySelectorAll('.book-item');
const linkList = document.querySelector('.link-list');
const tableData = document.querySelector('.table-data');
const notFound = document.getElementById('not-found');
const itemsPerPage = 15;
const fullSearchArray = [];

console.log('JS file is working!');

//searchButton is an event listener that calls searchBooks
// searchButton.addEventListener('click', () => {
//     searchBooks();
//     fullSearchArray.length = 0;
// });

//searchBooks searches the results on the page and hides the those that don't match the search.
function searchBooks() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    for (let i = 0; i < bookItem.length; i++) {
        if(bookItem[i].innerText.toLowerCase().includes(searchInput)) {
            bookItem[i].style.display='';
        } else {
            bookItem[i].style.display='none';
            fullSearchArray.push(bookItem[i]);
        }
    }
    if(fullSearchArray.length >= bookItem.length) {
        notFound.innerText = `The book you're looking for cannot be found`;
    } else if (fullSearchArray.length < bookItem.length){
        notFound.innerText ='';
    }
}



//==========================================================================
/* DOM manipulation methods for adding pagination */

//Experimental pagination based on data on the page - need to figure out how to get books data so that it can be 
// manipulated and added to the DOM.

function showPage(bookArray, page) {
    const startIndex = (page * itemsPerPage) - itemsPerPage;
    const endIndex = page * itemsPerPage;
    tableData.innerText="";
    for (let i = 0; i<bookArray.length; i++) {
        if ( i>=startIndex && i < endIndex) {
            const bookItem = 
            `<tr class="book-item"> 
                <td class="book-title"> 
                    <a href="/books/${book[i].id}">${book[i].title}</a>
                </td>
                <td class="book-author">${book[i].author}</td>
                <td class="book-genre">${book[i].genre}</td>
                <td class="book-year">${book[i].year}</td>
            </tr>`;
            bookList.insertAdjacentHTML("beforeend", bookItem);
        }
    }
}

function addPagination(bookArray) {
    console.log(bookItem.length)
    const numOfPages = Math.ceil(bookItem.length/itemsPerPage);
    linkList.innerHTML="";
    //console.log(numOfPages)
    for (let i = 1; i<= numOfPages; i++) {
        const button = `<li> <button type = "button">${[i]}</button> </li>`;
        linkList.insertAdjacentHTML("beforeend", button);
        document.querySelector(".link-list button").className="active";
    }
    linkList.addEventListener("click", (e) => {
        if(e.target.tagName ==="BUTTON") {
            document.querySelector('.active').className="";
            e.target.className="active";
            showPage(bookArray, e.target.textContent);
        }
    });
}

/*Call Functions */

// showPage(bookArray, 1);
//addPagination();