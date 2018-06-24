var express = require('express')
var find = require('array-find')
var slug = require('slug')
var bodyParser = require('body-parser')
var multer = require('multer')
var mongo = require('mongodb')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var User = require('./models/user')




require('dotenv').config()

mongoose.connect("mongodb://localhost:27017/dateapp");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var upload = multer({dest: 'static/upload/'})

var login = require('./routes/login'),
      register = require('./routes/register'),
      members = require('./routes/members'),
      member = require('./routes/member'),
      edit = require('./routes/edit'),
      message = require('./routes/message')

var app = express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(session({
    secret: 'datingapp backend',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }))
  .use(userId)
  .set('view engine', 'ejs')
  .set('views', 'view')
  .post('/registerUser', upload.single('cover'), registerUser)
  .post('/editUser', editUser)
  .post('/login', loginRoute)
  .get('/', login.render)
  .get('/register', register.render)
  .get('/members', members.render)
  .get('/account', account)
  .get('/matches', matches)
  .get('/message', message.render )
  .get('/:id', member.render)
  .get('/edit/:id', edit.render)
  .delete('/:id', remove)
  .use(notFound)
  .listen(8000)

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
    req.session.userId = user.id;
    return res.redirect('/account');
    }
  });
}

function userId(req, res, next) {
  res.locals.currentUser = req.session.userId;
  console.log(res.locals.currentUser);
  next();
};

function loginRoute (req, res, next){
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function(error, user){
        if (error || !user) {
          var err = new Error ('verkeerd gebruikersnaam of wachtwoord');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = user.id;
          res.redirect('/account');
        }
      });
        } else {
      }
  }

function notFound(req, res) {
  res.status(404).render('not-found.ejs')
}

function matches(req, res){
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
            res.render('matches', {
              title: 'matches',
              name: users.name,
              description: users.description,
              cover: users.cover,
              age: users.age,
              id: users.id});
          }
        });
}
function account(req, res, next){
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
          res.render('account', {
            title: 'account',
            name: users.name,
            description: users.description,
            cover: users.cover,
            age: users.age,
            id: users.id,
            username: users.name,
            password: users.password});
        }
      });
  }

function editUser(req, res){
  let updateUser = {};
    updateUser.name = req.body.name;
    updateUser.age = req.body.age;
    updateUser.description = req.body.description;
  let query = {id:req.params.id}
  // Schema create method om document in Mongo te zetten
  User.update(query, updateUser, function(err){
    if(err){
      console.log(err);
    return;
    } else {
      res.redirect('/account');
    }
  });
};

function remove(req, res, next) {
  var id = req.params.id
  console.log(req.url)
  db.collection('users').deleteOne({
    _id: new mongo.ObjectID(id)
    }, done)
    function done(err) {
      if (err) {
        next(err)
      } else {
      res.json({status: 'ok'})
    }
  }
}
