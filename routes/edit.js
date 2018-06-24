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


// Laad edit form
function edit(req, res, next){
if (!req.session.userId) {
  var err = new Error("Je bent niet bevoegd om de inhoud van deze pagina te bekijken");
  err.status = 403;
  return next(err);
}
  User.findById(req.session.userId)
    .exec(function (err, users){
      if (err) {
        console.log("in find by id is er dus geen error")
        return next(err);
      } else {
        res.render('edit', {
          title: 'Wijzig account gegevens',
          name: users.name,
          description: users.description,
          cover: users.cover,
          age: users.age,
          id: users.id});
      }
    });
  }





module.exports = {
    render: edit
}
