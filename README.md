# SQL Library Manager
![book image](public/images/library_books_3.png)

## Note: App is running on PORT 3001

### This is Project 8 for the Treehouse FSJS Techdegree

### You may start this project by typing _nodemon start_ in the command line after running _npm install_ from the project's main folder 

## Project Notes:

1. You may start this project by typing _nodemon start_ in the command line after running _npm install_ from the project's main folder.  It is running on **port 3001** 

2. Extensive notes have been added throughout the code.  They have been added so that the code is easier to follow (and I can figure out what's going on when I return to this project in the future).   
    - The `library.db` file contains 90+ rows/entries.
    - There are several log statments in the console while the app is running.
    - a JavaScript file `public\javascripts\script.js` has been added to the project, but is not currently doing anything.
    -  All routes are in `index,js` found in the `routes` folder.  All views are in the `views` folder.
    - All routes are in `index,js` found in the `routes` folder.  All views are in the `views` folder.

3. The styling has been changed to make the app more appealing.  The static CSS file has `normalize` add to make the page compatible across browser and the custom CSS is found below the `normalize` rules (on line 350).  

4. Search functionality and pagination have been added for extra credit.  Both the search and pagination and derived from Sequelize's functionality through using `findAndCountAll()` in place of `findAll()` for the `showBook` function that pulls the data.

5. The app has been tested in Chrome, Firefox (primarlly used for development) and Edge browsers.

6. Future updates will include additional fields for descriptions of a links for each book and styling to make the app look better and collapse better on mobile.




