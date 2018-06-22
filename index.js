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
const app = express()


require('dotenv').config()

mongoose.connect("mongodb://localhost:27017/dateapp");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var upload = multer({dest: 'static/upload/'})

express()
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
  .post('/register', upload.single('cover'), register)
  .post('/login', loginRoute)
  .get('/register', form)
  .get('/members', members)
  .get('/account', account)
  .get('/matches', matches)
  .get('/message', message)
  .get('/:id', member)
  .delete('/:id', remove)
  .get('/', login)
  .use(notFound)
  .listen(8000)

function userId(req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
};

function login(req, res, next){
res.render('login.ejs')
  }

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

function member(req, res, next){
var id;
  try {
    new mongo.ObjectID(req.params.id)
    } catch (err) {
  return next();
    }
db.collection('users').findOne({_id: id}, done)
    function done(err, data) {

      if (err) {
        next(err)
      } else {
        res.render('detail.ejs', {data: data})
      }
    }
  }
function form(req, res){
  res.render('register.ejs')
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

function message(req, res){
  res.render('message.ejs')
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
            id: users.id});
        }
      });
  }
function register(req, res, next){
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
function remove(req, res, next) {
 var id = req.params.id

db.collection('users').deleteOne({
  _id: new mongo.ObjectID(id)
}, done)

function done(err) {
    if (err) {
      next(err)
    } else {
      return res.redirect('/members');
    }
  }
}
