'use strict'

// ------------------------------------------
//  GLOBAL VARIABLES
// ------------------------------------------


const searchButton = document.getElementById('search-submit');



searchButton.addEventListener('click', () => {
    searchBooks();
});

function searchBooks() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    console.log(searchInput);
    const bookItem = document.querySelectorAll('.book-item');
    const bookTable = document.querySelector('.book-table');
    const bookList = document.querySelector('.book-list');
    for (let i = 0; i < bookItem.length; i++) {
        if(bookItem[i].innerText.toLowerCase().includes(searchInput)) {
            bookItem[i].style.display='';
        } else {
            bookItem[i].style.display='none';
        }
    } 
    
}