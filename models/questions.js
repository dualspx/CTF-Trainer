var mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    'title':{
        type: String,
        require: true
    },
    'question':{
        type: String,
        require: true
    },
    'filename':{
        type: String,
        require: true
    },
    'file':{
        type: Object,
        ref: 'fs.files',
    },
    'solve':{
        type: Boolean,
        default: false,
        require: true
    },
    'clue':{
        type: String,
        require: true
    },
    'answer':{
        type: String,
        require: true
    },
    'marks': {
        type: Number
    },
    'difficulty':{
        type: String
    }
})

const Question = mongoose.model('Question',questionSchema)

module.exports = Question