const express = require('express')
const find = require('array-find')
const slug = require('slug')
const bodyParser = require('body-parser')
const multer = require('multer')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const User = require('./models/user')



require('dotenv').config()

mongoose.connect("mongodb://localhost:27017/dateapp");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var upload = multer({dest: 'static/upload/'})

const login = require('./routes/login'),
      register = require('./routes/register'),
      members = require('./routes/members')




const app = express()
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
  .post('/registerUser', upload.single('cover'), register.user)
  .post('/login', loginRoute)
  .get('/register', register.render)
  .get('/members', members.render)
  .get('/account', account)
  .get('/matches', matches)
  .get('/message', message)
  .get('/:id', member)
  .delete('/:id', remove)
  .get('/', login.render)
  .use(notFound)
  .listen(8000)

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


function member(req, res, next){
console.log(req.url)
var id;
  try {
    new mongo.ObjectID(req.params.id)
    console.log(req.url);
    } catch (err) {
  return next();
    }
db.collection('users').findOne({id: id}, done)
    function done(err, data) {
      if (err) {
        next(err)
      } else {

        res.render('detail.ejs', {data: data})
      }
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
