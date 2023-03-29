var mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    'title':{
        type: String,
        require: true
    },
    'type':{
        type: String,
        require: true
    },
    'difficulty':{
        type: String,
        require: true
    },
    'question':{
        type: String,
        require: true
    },
    'filename':{
        type: String,
        
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
    },
    'solvers':[String]
})

const Question = mongoose.model('Question',questionSchema)

module.exports = Question