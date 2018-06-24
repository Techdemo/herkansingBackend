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


function register (req, res, next){
  res.render('register.ejs')
  console.log(req.url);
  }

module.exports = {
    render: register
}
