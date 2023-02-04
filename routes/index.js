var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Question = require('../models/questions')
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookie = require('cookie')
const jwt = require('jsonwebtoken');
const { query } = require('express');
const cookieParser = require('cookie-parser');
express().use(cookieParser())


router.get('/main',authenticateToken, function(req,res) {
	const token = req.cookies.access_token;
	console.log('token:',token)
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err,data) {
			if(err){
				res.status(403).send('Not authorized')
			}else{
        res.render('main_menu.ejs',{data: data.data});
			}
		})
})

router.get('/main_menu',authenticateToken,(req,res) => {
    res.render('main_menu')
})

router.get('/app',(req,res) => {
    res.render('app')
})

router.get('/quests', authenticateToken,(req,res) => {
  Question.find({}, (err,data) => {
    if(err) return res.status(403).send(err)

    else{
        // for(var i=0; i<data.length; i++){
        //     console.log("data",data[i].solve)
        //     return res.render('quests', {question: data})
        // }
        // console.log(data)
        console.log(data)
        
        return res.render('quests', {question: data})
    }
}); 
})

router.get('/logout',authenticateToken,(req,res) => {
  // const token = req.cookies.access_token;
  res.clearCookie('access_token');
  return res.redirect('/login');
})

async function authenticateToken( req, res, next) {
	const token = req.cookies.access_token;
	
  if (!token) {
    return res.status(202).redirect('/login');
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		console.log(token)
    // Almost done
		req.name = data.name;
    // req.userRole = data.role;
    return next();
  } catch {
    return res.sendStatus(403);
  }
}  

module.exports = router



