var express = require('express')
var find = require('array-find')
var slug = require('slug')
var bodyParser = require('body-parser')
var multer = require('multer')
var mongo = require('mongodb')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var User = require('../models/user')
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
  render: members,
}
