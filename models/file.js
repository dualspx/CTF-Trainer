var mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    'filename':String,
    'file':Buffer,
})

const File = mongoose.model('File',fileSchema)

module.exports = Question