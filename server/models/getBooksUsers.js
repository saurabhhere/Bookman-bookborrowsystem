const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
    },
    enrollment: {
        type: Number,
        required: true,
    },
    bookId: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    authenticatedUserId: {
        type: String,
        required: true
    },
    time : { type : Date, default: Date.now }
})

const BookRequests = mongoose.model('UsersBookRequests', userSchema);

module.exports = BookRequests;
