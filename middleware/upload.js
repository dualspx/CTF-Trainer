const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req,file,cb){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

var uploads = multer({
    storage: storage,
    fileFilter: function(req,res,callback){
        if(file.mimetype=="image/png" || file.mimetype =="image/jpg"){
            callback(null,true)
        }
        else{
            console.log('only jpg and png supporte')
            callback(null,false)
        }
    },
    
})

module.exports = uploads