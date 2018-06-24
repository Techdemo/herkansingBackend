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
var socket = require('socket.io')
var app = express();
var server = app.listen(4000)


// io.on('connection', function(socket){
//   console.log("socket connection gemaakt", socket.id);
//
//   socket.on('chat', function(data){
//       io.sockets.emit('chat', data);
// });
// socket.on('typing', function(data){
//   socket.broadcast.emit('typing', data)
//   })
// });

var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

});






function message(req, res){
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
            res.render('message', {
              title: 'message',
              name: users.name,
              description: users.description,
              cover: users.cover,
              age: users.age,
              id: users.id});
          }
        });
}
module.exports = {
    render: message
}
