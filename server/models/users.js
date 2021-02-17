const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String, 
        required: true,
        unique: true
    },
    enrollment: {
        type: Number,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    time : { type : Date, default: Date.now }
})

const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;
