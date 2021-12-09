'use strict'

// ------------------------------------------
//  GLOBAL VARIABLES
// ------------------------------------------

// const express = require('express');
// const router = express.Router();
// const Book = require('../models').Book
const searchButton = document.getElementById('search-submit');
const bookTable = document.querySelector('.book-table');
const bookItem = document.querySelectorAll('.book-item');
const linkList = document.querySelector('.link-list');
const tableData = document.querySelector('.table-data');
const notFound = document.getElementById('not-found');
const itemsPerPage = 15;
const fullSearchArray = [];

// console.log(bookItem);
// console.log(Array.from(bookItem)); 

searchButton.addEventListener('click', () => {
    searchBooks();
    // bookTable.innerHTML;
    fullSearchArray.length = 0;
    console.log(fullSearchArray.length)
});

function searchBooks() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    console.log(searchInput);
    
    for (let i = 0; i < bookItem.length; i++) {
        if(bookItem[i].innerText.toLowerCase().includes(searchInput)) {
            bookItem[i].style.display='';
        } else {
            bookItem[i].style.display='none';
            fullSearchArray.push(bookItem[i]);
        }
    }
   
    console.log(fullSearchArray.length);
   
    if(fullSearchArray.length >= bookItem.length) {
        notFound.innerText = `The book you're looking for cannot be found`;
    } else if (fullSearchArray.length < bookItem.length){
        notFound.innerText ='';
    }
}

function showPage(list, page) {
    const startIndex = (page * itemsPerPage) - itemsPerPage;
    const endIndex = page * itemsPerPage;
    tableData.innerText="";
    for (let i = 0; i<list.length; i++) {
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

function addPagination(list) {
    console.log(bookItem.length)
    const numOfPages = Math.ceil(bookItem.length/itemsPerPage);
    linkList.innerHTML="";
    console.log(numOfPages)
    for (let i = 1; i<= numOfPages; i++) {
        const button = `<li> <button type = "button">${[i]}</button> </li>`;
        linkList.insertAdjacentHTML("beforeend", button);
        document.querySelector(".link-list button").className="active";
    }
    linkList.addEventListener("click", (e) => {
        if(e.target.tagName ==="BUTTON") {
            document.querySelector('.active').className="";
            e.target.className="active";
            showPage(list, e.target.textContent);
        }
    });
}

/*Call Functions */

// showPage(book, 1);
// addPagination(book);