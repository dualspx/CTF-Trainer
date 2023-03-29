var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    score: {
        reverse_engineer:{
            type: Number,
            default: 0
        },
        web: {
            type: Number,
            default: 0
        },
        cryptography: {
            type: Number,
            default: 0
        },
        forensics:{
            type: Number,
            default: 0
        },
    },
    solved: {
        reverse_engineer:{
            type: Number,
            default: 0
        },
        web: {
            type: Number,
            default: 0
        },
        cryptography: {
            type: Number,
            default: 0
        },
        forensics:{
            type: Number,
            default: 0
        },
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User