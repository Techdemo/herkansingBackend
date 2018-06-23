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
var db = mongoose.connection;




function members(req, res) {
   
  db.collection('users').find().toArray(done)
   function done(err, data) {
     if(err) {
       next(err)
       } else {
         res.render('list.ejs', {data: data})
       }
     }
   }





module.exports = {
  render: members
}
