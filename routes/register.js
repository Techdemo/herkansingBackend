const express = require('express')
const find = require('array-find')
const slug = require('slug')
const bodyParser = require('body-parser')
const multer = require('multer')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const User = require('../models/user')


function registerUser(req, res, next){
      var userData = {
        name: req.body.name,
        cover: req.file.filename,
        age: req.body.age,
        description: req.body.description,
        username: req.body.username,
        password: req.body.password
        };
        // Schema create method om document in Mongo te zetten
  User.create(userData, function (error, user){
    if (error) {
      next(error);
  } else {
    req.session.userId = user._id;
    return res.redirect('/members');
    }
  });
}


function register (req, res, next){
  res.render('register.ejs')
  }





module.exports = {
    render: register,
    user: registerUser
}
