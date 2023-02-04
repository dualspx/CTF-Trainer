var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    score:Number,
    token: String //authentication
})

const User = mongoose.model('User', userSchema)

module.exports = User