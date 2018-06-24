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

function member(req, res, next){

var id;
try {
  new mongo.ObjectID(req.params.id)
} catch (err) {
  return next();
}


var id = req.params.id;

db.collection('users').findOne({_id: mongo.ObjectId(id)}, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      console.log("in de function done");
      res.render('detail.ejs', {data: data})
    }
  }
}

module.exports = {
  render: member
}
