'use strict'

// ------------------------------------------
//  GLOBAL VARIABLES
// ------------------------------------------

const searchButton = document.getElementById('search-submit');
const bookTable = document.querySelector('.book-table');
const bookItem = document.querySelectorAll('.book-item');
const linkList = document.querySelector('.link-list');
const itemsPerPage = 15;

searchButton.addEventListener('click', () => {
    searchBooks();
});

function searchBooks() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    console.log(searchInput);
    //const bookItem = document.querySelectorAll('.book-item');
    
    for (let i = 0; i < bookItem.length; i++) {
        if(bookItem[i].innerText.toLowerCase().includes(searchInput)) {
            bookItem[i].style.display='';
        } else {
            bookItem[i].style.display='none';
        }
    }
    // console.log(bookArray.length); 
    // if(bookArray.length === 0) {
    //     bookTable.innerHTML = `<h2>cannot be found</h2>`;
    //     bookArray.push(searchInput);
    // }
}

function showPage(list, page) {
    const startIndex = (page * itemsPerPage) - itemsPerPage;
    const endIndex = page * itemsPerPage;

}

function addPagination() {
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