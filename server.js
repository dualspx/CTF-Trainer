require('dotenv').config()

const uri = 'mongodb://localhost:27017/CTFLearn'
const express =  require('express')
const app = express();
const flash = require('express-flash')
const jwt = require('jsonwebtoken');
var session = require('express-session'); 
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')

var main = require('./routes/main')
var questions = require('./routes/questions');
var user = require('./routes/user');
var index = require('./routes/index');
const cookieParser = require('cookie-parser');
const { patch } = require('./routes/index');
var path = require('path')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const conn = mongoose.createConnection(uri)

let gfs

app.set('view engine', 'ejs')
mongoose.set('strictQuery', true)
var connection = mongoose.connect(uri, 
    (err) => {
    if (!err) {
      console.log('MongoDB Connection Succeeded.')
    } else {
      console.log('Error in DB connection : ' + err)
    }
});

conn.once('open',  () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads')
})

// //storage engine
// const storage = new GridFsStorage({
//   url:uri,
//   file: (req,res) => {
//     return new Promise((resolve,reject) => {
//       crypto.randomBytes(16, (err,buf) => {
//         if(err) return reject(err)

//         const filename = buf.toString('hex') + path.extname(file.originalname)
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         }
//         resolve(fileInfo)
//       })
//     })
//   }
// })
// const upload = multer({storage})

app.use(flash())
app.use(cookieParser())
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,   
}))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,'/public')))

app.use('/', main) //for unregistered user
app.use('/', index) //for registered user

app.use('/', questions)
app.use('/profile', user)


app.listen(3000, ()=> {
    console.log('Server listening port 3000')
})