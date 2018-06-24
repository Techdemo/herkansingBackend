# herkansing - Backend

This web app is created for the course of Backend. I am still working on it to make it into a dating app in which users can give their preference and find a suitable other user to date with.

## How to install
To install you need to take the following steps

First mkdir a file to put the project in, on your machine.
Then, run the following command to clone it
clone https://github.com/Techdemo/herkansingBackend.git

I've used [MongoDB](https://www.mongodb.com/) as database, so you'll have to install that too. Then you need to take the following steps to get the app running.
Use Homebrew in your terminal to:
* `brew install MongoDB`
* `brew services start MongoDB`

Make a directory to place your DB in, do this in your terminal using bash.
* `mkdir db`
* `mongod --dbpath db`

Open the mongo shell by doing:
* `Mongo`
* `use DateApp`
* `db.runCommand( { create: "users" } )`
* `db.runCommand( { create: "sessions" } )`

In your database, there are two collections ready now. One for the users to store in and the other for the sessions. When a user logs in, a session id is created in the sessions collection. This works fine when there are multiple users, so your local machine doesn't go out of processing power.

Go to the root of your project and create a `.env` file in which to store your database secret info.

* `touch .env`
* `echo "`
* `DB_HOST=localhost`
* `DB_PORT=27017`
* `DB_NAME=dating-db`
* `SESSION_SECRET=zegikniet`
* `" >> .env`

for the final touch, we have to build our project with
* `npm install`
* `nodemon`

## file structure

* ### models
Contains the model used by [Mongoose](http://mongoosejs.com) to register the user in the database. The model is used to store the structure of the objectId in Mongodb.
* ### routes
Contains all the different routes.
* ### static
contains all of the static Js and Css files. Static also contains the upload folder used by [Multer](https://github.com/expressjs/multer) to store profilephoto's uploaded by the users.
* ### view
Contains all of the views. In my views I've used [EJS](http://ejs.co) as templating language. By using EJS, I can display session variables and properties of the ObjectId  from the mongo database in my views.

Everything else is display in the index.js file.

## file structure
The database contains 2 collections. One `Users` and one `session` collection. As stated above, the Users collection contains all of the users and their objectId's.
The session collection is used when a user logs into the app. When the user logs in, a session is created and stored in the Mongo database. I choose to store the session in the database because if all of the sessions are stored on the local machines, it takes too much of its processing power.

## technology user

- [Node js](https://nodejs.org/en/)
  - [Body Parser](https://github.com/expressjs/body-parser)
  - [Multer](https://github.com/expressjs/multer)
  - [Nodemon](https://nodemon.io)
  - [Dotenv](https://www.npmjs.com/package/dotenv)
- [Express](https://www.express.com/)
- [EJS](http://ejs.co/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](http://mongoosejs.com)
- [Bcrypt](https://www.npmjs.com/package/bcrypt) used for hashing and salting the password of a user profile
- [MongoStore](9https://github.com/jdesboeufs/connect-mongo) let the user store the session in the mongo database.
- [SocketIO](https://socket.io) used for the chat functionalities

Unfortunatly, there are still some things to do.

- [ ] Let users choose their partner preferences
- [ ] Let users only see other users, that match their preferences
- [ ] Have a separate chat window, per user.
- [ ] Finish log-out route **_currently working on this_**

# personal opinion
I've learned so much doing this assignment! Even though, I have the feeling I'm still not really far in learning express/node js. There is so much ground and information to cover!

I had a lot of fun trying out different stuff and I'm proud of the socket io integration.

But I am still a little bit disapointed that I didn't manage to create the feature to filter other users, based on their preferences.

For now, I'm proud of the result and I will continue to work on this project. 
