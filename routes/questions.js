var express = require('express')
var router = express.Router()
var User = require('../models/user')
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookie = require('cookie')
const jwt = require('jsonwebtoken');
const { query } = require('express');
const cookieParser = require('cookie-parser');
const mime = require('mime')
const path = require('path')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
var Question = require('../models/questions')
const uri = 'mongodb+srv://doadmin:U10AzWHN95l238Q7@ctf-learn-6650c479.mongo.ondigitalocean.com/admin?tls=true&authSource=admin'
express().use(cookieParser())
const Grid = require('gridfs-stream');
const conn = mongoose.createConnection(uri, { useNewUrlParser: true });
const flash = require('connect-flash');
let gfs,gridfsBucket

mongoose.connection.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  })
  gfs = Grid(mongoose.connection.db, mongoose.mongo)
  // var grid = this.gfs
  gfs.collection('uploads')
})

const storage = new GridFsStorage({
  url: uri,
  file: (req,file) => {
    return new Promise((resolve,reject) => {
      const filename = file.originalname
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads',
        metadata: {
          name: req.body.title
        }
      }
      resolve(fileInfo)
    })
  }
})

const upload = multer({storage})

router.get('/create',(req,res) => {
    return res.render('question')
})

router.post('/create',upload.single('file'), async(req,res) => {
  console.log(req.body.title)
    try{
        const newQuestion = Question({
            title: req.body.title,
            question: req.body.question,
            type: req.body.type,
            difficulty: req.body.difficulty,
            file: req.file,
            solve: false,
            clue: req.body.clue,
            answer: req.body.answer,
            marks: req.body.marks
        })
        newQuestion.save((err) =>{
            if(err){
                return res.json(err)
            }
            else{
                return res.send('Successfully create question')
            }
        })
    }catch(err){
        console.log(err)
        return res.send(403)
    }
    
})

// @route GET /files
// @desc  Display all files in JSON
router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

router.get('/download/:filename',(req,res) => {
  console.log(req.params.filename)
  try {
    gfs.files.findOne({filename: req.params.filename} ,(err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        })
      }
        var readstream =  gridfsBucket.openDownloadStreamByName(file.filename)
        readstream.pipe(res)
        // Handling error event
        readstream.on("error", err => {
          console.log(err);
          res.status(404)
        });
        
        console.log("Done...");
        res.status(200)
      
    })
  } 
  catch (error) {
    console.log(error)
  }
})

router.post('/submit_answer/:id',authenticateToken, async(req,res) => {
  const id = req.params.id;
  const answer = req.body.answer;
  const name = req.name
  const uid = req.id
  console.log("solvers: "+name)
  try {
    const question = await Question.findById(id);
    console.log("Marks: "+question.marks)
    if (!question) {
      return res.status(404).send({ message: 'Question not found' });
    }

    if (question.answer === answer) {
      const user = await User.findById(uid)
      question.solve = true;
      question.solvers.push(name);
      console.log("question type:"+question.type)
      console.log("question mark:"+question.marks)
      if(question.type == 'reverse_engineering'){
        user.solved.reverse_engineer += 1
        user.score.reverse_engineer += question.marks
        await user.save()
      }
      else if(question.type == 'web'){
        user.solved.web += 1
        user.score.web += question.marks
        await user.save()
      }
      else if(question.type == 'cryptography'){
        user.solved.cryptography += 1
        user.score.cryptography += question.marks
        await user.save()
      }
      else if(question.type == 'forensics'){
        user.solved.forensics += 1
        user.score.forensics += question.marks
        await user.save()
      }
      else{
        res.send("An error occured!").status(500)
      }

      await question.save();
      req.flash('message','correct')
      return res.status(200).redirect('/quests')
    } else {
      req.flash('message','not correct')
      return res.redirect('/quests')
    }
  } catch (error) {
    res.status(500).send(error);
  }
  
})

async function authenticateToken( req, res, next) {
	const token = req.cookies.access_token;
	
  if (!token) {
    return res.status(202).redirect('/login');
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		// console.log(data.data.username)
    // Almost done
    req.name = data.data.name
		req.id = data.data._id;
    // req.userRole = data.role;
    console.log(req.name)
    return next();
  } catch {
    return res.sendStatus(403);
  }
}  

module.exports = router