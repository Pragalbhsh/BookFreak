const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
       type: String,
       required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
    },
    city: {
        type: String,
    },
    role: {
        type: String,
        default: 'user',  // can be 'user' or 'admin'
    }
    },
    {timestamps: true})



module.exports = mongoose.model('User' , userSchema); // mongoose automatically Gives you methods like:
// User.create() → add new user
// User.find() → get all users
// User.findById() → get one user
// User.findByIdAndUpdate() → update user
// User.findByIdAndDelete() → delete user