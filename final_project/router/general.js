const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    })
    .then((books) => {
        res.status(200).json(books);
    })
    .catch((error) => {
        res.status(500).json({ message: "Error getting books", error });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const { isbn } = req.params;

    new Promise((resolve, reject) => {
        const book = books[isbn];
        resolve(book);
    })
    .then((book) => {
        res.status(200).json(book);
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const { author } = req.params;

    new Promise((resolve, reject) => {
        const bookAuthor = Object.values(books).filter(book => book.author === author);
        resolve(bookAuthor);
    })
    .then((bookAuthor) => {
        res.status(200).json(bookAuthor);
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const { title } = req.params;

    new Promise((resolve, reject) => {
        const bookTitle = Object.values(books).find(book => book.title === title);
        resolve(bookTitle);
    })
    .then((bookTitle) => {
        res.status(200).json(bookTitle);
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;

    res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
