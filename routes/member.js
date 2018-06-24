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


function member(req, res, next) {
  var id = req.params.id

  db.collection('users').findOne({
    _id: new mongo.ObjectID(id)
  }, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.render('detail.ejs', {data: data})
    }
  }

}

module.exports = {
  render: member
}
