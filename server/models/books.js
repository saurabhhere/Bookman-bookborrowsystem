const mongoose = require('mongoose');

const booksSchema = mongoose.Schema({
    book: {
        type: String,
        required: true
    },
    author: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    bookImage: {
        type: String,
        required: true
    },
    authenticatedUserId: {
        type: String,
        required: true
    },
    time : { type : Date, default: Date.now }
})

const BooksModel = mongoose.model('Books', booksSchema);

module.exports = BooksModel;
