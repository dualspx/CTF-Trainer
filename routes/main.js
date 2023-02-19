var express = require('express')
var router = express.Router()
var User = require('../models/user')
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookie = require('cookie')
const jwt = require('jsonwebtoken');
const { query } = require('express');
const cookieParser = require('cookie-parser');
express().use(cookieParser())

router.get('/', (req,res) =>{
    res.redirect('/register')
})

router.get('/register',(req,res)=> {
    res.render('register1.ejs')
})

router.post('/register',(req,res)=>{
    try{
        const newUser = User({
            username:req.body.username,
            password: req.body.password,
        })
        newUser.save((error) => {
            if (error) {
              // send an error response if there was a problem
              res.status(500).send(error);
            } else {
              // create a JWT for the user
              const token = jwt.sign({ _id: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
        
              // save the JWT to the database
              User.updateOne({ _id: newUser._id }, { token }, (error) => {
                if (error) {
                  // send an error response if there was a problem
                  res.status(500).send(error);
                } else {
                  // send the JWT as the response
                  res.redirect('/login');
                }
              });
            }
        })
    }
    catch(err){
        res.send(err)
        res.redirect('/register')
    }
})

router.get('/login', (req,res)=>{
    res.render('login.ejs')
})


router.post('/login', (req,res) =>{
	console.log(req.body.email)
    User.findOne({username:req.body.username,password:req.body.password}, function(err,data){
    if(data){
        //create a JWT for user
        const token = jwt.sign({data}, process.env.ACCESS_TOKEN_SECRET)
				
        //set JWT as cookie
        return res.cookie('access_token',token,{
					httpOnly:true,
					secure: process.env.ACCESS_TOKEN_SECRET
				}).status(200)
        .redirect('http://localhost:3000/quests')
    }
    else {
      return res.status(200).render('login.ejs',{messages:"Wrong credentials"})
    }
    })
})

router.get('/about', (req,res)=> {
  res.render('about.ejs')
})



module.exports = router